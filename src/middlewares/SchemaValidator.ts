import { ValidateFunction } from 'ajv';
import { RequestHandler, Request } from 'express';

import { ValidationException } from '../exceptions';

export const validateOrThrow = (validator: ValidateFunction, toValidate: any = {}) => {
  if (!validator(toValidate)) {
    throw new ValidationException({
      errors: validator.errors || [],
    });
  }
};

const validate =
  (validator: ValidateFunction, builder: (req: Request) => any): RequestHandler =>
  (req, _res, next) => {
    const toValidate = builder(req);
    validateOrThrow(validator, toValidate);
    next();
  };

export const validateIncomingData = (validator: ValidateFunction): RequestHandler => validate(validator, (req: Request) => req.body);

export const validateQuery = (validator: ValidateFunction): RequestHandler => validate(validator, (req: Request) => req.query);

export const validateParams = (validator: ValidateFunction): RequestHandler => validate(validator, (req: Request) => req.params);
