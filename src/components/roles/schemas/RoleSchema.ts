import { RoleType } from 'enums';
import _ from 'lodash';

const properties = {
  id: { type: 'string', minLength: 1 },
  role: { type: 'string', enum: Object.values(RoleType) },
  profileId: { type: 'string', minLength: 1 },
  organizationId: { type: 'string', minLength: 1, nullable: true },
  avatarUrl: { type: 'string', nullable: true },
};

export const modelSchema = {
  type: 'object',
  additionalProperties: false,
  properties: { ...properties, createdAt: { type: 'string' }, updatedAt: { type: 'string' } },
  required: ['role', 'profileId'],
};

export const createSchema = {
  type: 'object',
  additionalProperties: false,
  properties: _.pick(properties, ['role', 'avatarUrl']),
};
