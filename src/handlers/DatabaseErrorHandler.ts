import { LoggerFactory } from '@otedesco/server-utils';
import { BaseException, InternalServerError, NotNullError, UniqueViolatedError } from '@otedesco/commons';
import { DBError, NotNullViolationError, UniqueViolationError } from 'objection-db-errors';

const { logger } = LoggerFactory.getInstance(__filename);

// TODO: IMPLEMENT ALL OBJECTION ERRORS
export function DatabaseErrorHandler(err: Error) {
  logger.error(err);
  if (err instanceof UniqueViolationError) {
    return new BaseException({
      status: 409,
      message: UniqueViolatedError.message,
      code: UniqueViolatedError.code,
      data: {
        columns: err.columns,
        table: err.table,
        constraint: err.constraint,
      },
    });
  }
  if (err instanceof NotNullViolationError) {
    return new BaseException({
      message: NotNullError.message,
      code: NotNullError.code,
      data: {
        column: err.column,
        table: err.table,
      },
    });
  }
  if (err instanceof DBError) {
    return new BaseException({
      status: 500,
      message: InternalServerError.message,
      code: InternalServerError.code,
      data: {},
    });
  }

  return {};
}
