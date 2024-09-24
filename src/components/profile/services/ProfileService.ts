import { notifySync } from '@otedesco/notify';
import { Transaction } from 'objection';

import { Components, EventsByComponent, Topics } from '../../../configs';
import { InternalServerException } from '../../../exceptions';
import { Profile } from '../interfaces/Profile';
import * as CachedRepository from '../repositories/CachedProfileRepository';

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
  return CachedRepository.findOne(profile);
}

export async function create(profile: Partial<Profile>, tx?: Transaction): Promise<Profile> {
  const record = await CachedRepository.create(mapProfile(profile), tx);
  // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
  notifySync(topic, events.CreatedEvent, profile);

  return record;
}
