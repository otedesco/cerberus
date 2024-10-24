import { notifySync } from '@otedesco/notify';
import { ValidationException } from 'exceptions';
import _ from 'lodash';
import { Transaction } from 'objection';

import { Components, EventsByComponent, Topics } from '../../../configs';
import { Role } from '../interfaces/Role';
import { RolesRepository as Repository } from '../repositories';

const topic = Topics[Components.ROLE];
const events = EventsByComponent[Components.ROLE];

const canCreateNewRole = (existingRoles: Role[], params: Partial<Role>): boolean => {
  const roleFilter = params.organizationId ? { role: params.role, organizationId: params.organizationId } : { role: params.role };

  return !existingRoles.some((role) => _.isMatch(role, roleFilter));
};

export async function findOne(filter: Partial<Role>) {
  return Repository.findSimple(filter);
}

export async function find(filter: Partial<Role>) {
  return Repository.find(filter);
}

export async function create(role: Partial<Role>, tx?: Transaction) {
  const existingRoles = await Repository.findSimple({ profileId: role.profileId }, tx);

  if (!canCreateNewRole(existingRoles, role)) {
    throw ValidationException.buildFromMessage('Role already exists', { role: role.role });
  }
  const record = await Repository.create(role, tx);
  // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
  notifySync(topic, events.CreatedEvent, record);

  return record;
}
