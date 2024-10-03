import { notifySync } from '@otedesco/notify';
import { Transaction } from 'objection';

import { Components, EventsByComponent, Topics } from '../../../configs';
import { Role } from '../interfaces/Role';
import { RolesRepository as Repository } from '../repositories';

const topic = Topics[Components.ROLE];
const events = EventsByComponent[Components.ROLE];

export async function create(role: Partial<Role>, tx?: Transaction) {
  const record = await Repository.create(role, tx);
  // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
  notifySync(topic, events.CreatedEvent, role);

  return record;
}

export async function findOne(filter: Partial<Role>) {
  return Repository.findSimple(filter);
}

export async function find(filter: Partial<Role>) {
  return Repository.find(filter);
}
