import { AccountStatus } from '../../../enums';

const properties = {
  id: { type: 'string', minLength: 1 },
  email: { type: 'string' },
  password: { type: 'string' },
  salt: { type: 'string' },
  status: {
    type: 'string',
    enum: Object.values(AccountStatus),
  },
};

export const modelSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ...properties,
    profiles: { type: 'array', items: { type: 'string' }, nullable: true },
    sessions: { type: 'array', items: { type: 'string' }, nullable: true },

    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  required: ['email', 'password', 'salt', 'status'],
};

export const createSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password', 'passwordConfirmation'],
  properties: {
    ...properties,
    passwordConfirmation: {
      type: 'string',
      const: {
        $data: '1/password',
      },
    },
  },
};

export const emailVerificationSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    otp: { type: 'string', nullable: false, minLength: 6 },
  },
  required: ['otp'],
};

export const recoverySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    email: { type: 'string', nullable: false },
  },
  required: ['email'],
};

export const changePasswordSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    password: { type: 'string', nullable: false },
    passwordConfirmation: {
      type: 'string',
      nullable: false,
      const: {
        $data: '1/password',
      },
    },
  },
  required: ['password', 'passwordConfirmation'],
};
