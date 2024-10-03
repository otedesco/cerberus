import { Transaction } from 'objection';

import { ProfileDetail } from '../interfaces';
import { ProfileDetails } from '../models';

export async function create(params: Partial<ProfileDetail>, tx?: Transaction) {
  return ProfileDetails.query(tx).insert(params);
}

export async function update({ id, ...updatedKeys }: Partial<ProfileDetail>, tx?: Transaction) {
  return ProfileDetails.query(tx).patch(updatedKeys).where({ id }).returning('*').first();
}
