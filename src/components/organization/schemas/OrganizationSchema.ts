import { RoleType } from '../../../enums';

export const createSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'country'],
  properties: {
    name: { type: 'string' },
    country: { type: 'string' },
  },
};

const invite = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'role'],
  properties: {
    email: { type: 'string' },
    role: { enum: Object.values(RoleType) },
  },
};

export const inviteSchema = {
  type: 'array',
  items: invite,
};
