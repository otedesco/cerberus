import { notifySync } from '@otedesco/notify';
import { Transaction } from 'objection';

import { Components, EventsByComponent, Topics } from '../../../configs';
import { InternalServerException } from '../../../exceptions';
import { Profile } from '../interfaces/Profile';
import { CachedProfileRepository as CachedRepository } from '../repositories';

const topic = Topics[Components.PROFILE];
const events = EventsByComponent[Components.PROFILE];

function mapProfile({ accountId, name, lastname, avatarUrl, detailsId }: Partial<Profile>): Partial<Profile> {
  if (!accountId) throw new InternalServerException();

  return {
    accountId,
    name: name ?? '',
    lastname: lastname ?? '',
    avatarUrl,
    detailsId,
  };
}

export async function findOne(profile: Partial<Profile>) {
  return CachedRepository.findOne(profile);
}

export async function create(params: Partial<Profile>, tx?: Transaction): Promise<Profile> {
  const profileParams = mapProfile(params);
  const profile = await CachedRepository.create(profileParams, tx);

  // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
  notifySync(topic, events.CreatedEvent, profile);

  return profile;
}

export async function update(params: Partial<Profile>, tx?: Transaction): Promise<Profile | undefined> {
  const profile = await CachedRepository.update(params, tx);

  // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
  notifySync(topic, events.UpdatedEvent, profile);

  return profile;
}
