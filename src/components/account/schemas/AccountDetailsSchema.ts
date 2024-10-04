import _ from 'lodash';

import { VerificationStatusEnum } from '../../../enums';

const properties = {
  id: { type: 'string', minLength: 1 },
  emailVerificationStatus: { type: 'string', enum: Object.values(VerificationStatusEnum) },
  phoneVerificationStatus: { type: 'string', enum: Object.values(VerificationStatusEnum) },
  identityVerificationStatus: { type: 'string', enum: Object.values(VerificationStatusEnum) },
  legalFirstname: { type: 'string', nullable: true },
  legalLastname: { type: 'string', nullable: true },
  govermentId: { type: 'string', nullable: true },
  address: { type: 'string', nullable: true },
  city: { type: 'string', nullable: true },
  state: { type: 'string', nullable: true },
  zipcode: { type: 'string', nullable: true },
  country: { type: 'string', nullable: true },
  accountId: { type: 'string', minLength: 1 },
};

export const modelSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ...properties,

    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  required: ['accountId'],
};

export const upsertSchema = {
  type: 'object',
  additionalProperties: false,
  properties: _.omit(properties, ['emailVerificationStatus', 'phoneVerificationStatus', 'identityVerificationStatus']),
};
