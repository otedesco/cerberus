import { Transaction } from 'objection';

import { ProfileService } from '..';
import { Profile, ProfileDetail } from '../interfaces';
import { ProfileDetailsRepository } from '../repositories';

export async function upsert({ id, accountId, detailsId }: Profile, params: Partial<ProfileDetail>, tx?: Transaction): Promise<ProfileDetail | undefined> {
  if (detailsId) {
    return ProfileDetailsRepository.update({ id: detailsId, ...params }, tx);
  }
  const details = await ProfileDetailsRepository.create(params, tx);
  await ProfileService.update({ id, accountId, detailsId: details.id }, tx);

  return details;
}
