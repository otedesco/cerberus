import { Transaction } from 'objection';

import { Profile, ProfileDetail } from '../interfaces';
import { ProfileDetailsRepository } from '../repositories';

export async function upsert({ id, details }: Profile, params: Partial<ProfileDetail>, tx?: Transaction): Promise<ProfileDetail | undefined> {
  if (details) {
    return ProfileDetailsRepository.update({ id: details.id, ...params }, tx);
  }

  return ProfileDetailsRepository.create({ profileId: id, ...params }, tx);
}
