import _ from 'lodash';

import { ResourceNotFoundException } from '../exceptions/ResourceNotFoundException';

const buildResponse = <T>(status: number, data: T): { status: number; data: T } => ({ status, data });

export const success = (data: any) => buildResponse(200, data);

export const notFound = (data: object | null) => {
  throw new ResourceNotFoundException({
    data,
  });
};

export type Options = {
  notFoundHandler?: typeof notFound | typeof success | ((data: any) => any);
  defaultResponse?: any;
  code?: number;
};

export const resolveResponse = async <T>(value: Promise<T>, options: Options = {}) => {
  const { notFoundHandler = notFound, defaultResponse = {} } = options;
  const records = await value;
  if (_.isEmpty(records)) {
    return notFoundHandler(records);
  }

  return success(records ?? defaultResponse);
};

export const createResponse = async <T>(value: Promise<T>, options: Options = {}) => {
  const { defaultResponse = { data: null }, code = 201 } = options;
  const records = await value;

  return buildResponse<T>(code, records || defaultResponse);
};
