import { BaseException } from '@otedesco/commons';
import { NextFunction, Request, Response } from 'express';

import { ADMIN_API_KEY, API_KEY_HEADER } from '../configs';
import { ValidationException } from '../exceptions';

import { allHeaders } from './validators/HeadersValidator';

const validateApiKey = (headerValue: string | null, value: string, errorMessage: string) => {
  if (headerValue !== value) {
    throw new BaseException({
      status: 401,
      message: errorMessage,
      data: { [API_KEY_HEADER]: 'Is required' },
    });
  }
};

export function validateAllHeaders(req: Request, res: Response, next: NextFunction) {
  if (!allHeaders(req.headers)) {
    return next(
      new ValidationException({
        errors: allHeaders.errors || [],
      }),
    );
  } else {
    return next();
  }
}

export function validateAdminApiKey(req: Request, res: Response, next: NextFunction) {
  validateApiKey(req.get(API_KEY_HEADER) ?? null, ADMIN_API_KEY, 'Invalid Admin Api Key');

  next();
}
