import { QueryBuilder, Transaction } from 'objection';

import { ProfileDetail } from '../interfaces';
import { ProfileDetails } from '../models';

function filterQuery(query: QueryBuilder<ProfileDetails>, filter: Partial<ProfileDetail>) {
  const { id, profileId } = filter;

  if (profileId) query.where('profile_id', profileId);
  if (id) query.where('id', id);

  return query;
}

export async function create(params: Partial<ProfileDetail>, tx?: Transaction) {
  return ProfileDetails.query(tx).insert(params);
}

export async function update({ id, ...updatedKeys }: Partial<ProfileDetail>, tx?: Transaction) {
  return ProfileDetails.query(tx).patch(updatedKeys).where({ id }).returning('*').first();
}

export function findOneSimple(filter: Partial<ProfileDetail>, tx?: Transaction) {
  return filterQuery(ProfileDetails.query(tx), filter).first();
}
