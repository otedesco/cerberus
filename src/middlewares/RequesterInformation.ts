import { BaseException } from '@otedesco/commons';
import { NextFunction, Request, Response } from 'express';

import { USER_ID_HEADER } from '../configs';

import { requesterValidator } from './validators/RequesterValidator';

export function requesterInformation(req: Request, res: Response, next: NextFunction) {
  const { [USER_ID_HEADER]: userId } = req.headers;

  const dataReq = {
    userId,
  };

  if (!requesterValidator(dataReq)) {
    throw new BaseException({
      status: 401,
      message: 'Requester Information Is required',
    });
  } else {
    res.locals.requester = dataReq;
    next();
  }
}
