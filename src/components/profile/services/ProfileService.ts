import { notify } from '@otedesco/notify';
import { Transaction } from 'objection';

import { Components, EventsByComponent, Topics } from '../../../configs';
import { InternalServerException } from '../../../exceptions';
import { Profile } from '../interfaces/Profile';
// import * as CachedRepository from '../repositories/CachedProfileRepository';
import * as Repository from '../repositories/ProfileRepository';

const topic = Topics[Components.PROFILE];
const events = EventsByComponent[Components.PROFILE];

function mapProfile({ account, name, lastname, avatarUrl }: Partial<Profile>): Partial<Profile> {
  if (!account) throw new InternalServerException();

  return {
    account,
    name: name ?? '',
    lastname: lastname ?? '',
    avatarUrl,
  };
}

export async function findOne(profile: Partial<Profile>) {
  return Repository.findOne(profile);
}

export async function create(profile: Partial<Profile>, tx?: Transaction): Promise<Profile> {
  const record = await Repository.create(mapProfile(profile), tx);
  notify(topic, events.CreatedEvent, profile);

  return record;
}

export async function findProfileRoles(filter: Partial<Profile>): Promise<Profile | undefined> {
  return Repository.findEager(filter, '[roles.[organization]]');
}

// export async function findOne(filter: Partial<Profile>) {
//   return Repository.findOne(filter);
// }
