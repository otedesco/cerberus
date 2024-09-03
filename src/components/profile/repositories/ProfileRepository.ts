import _ from 'lodash';
import { QueryBuilder, Transaction } from 'objection';

import { Account } from '../../account';
import { Profile } from '../interfaces';
import { Profiles } from '../models';

const filterQuery = (query: QueryBuilder<Profiles, Profiles[]>, filter: Partial<Profile>) => {
  const { id, account } = filter;

  if (account) query.where(`${Profiles.tableName}.account`, '=', _.get(account, 'id', account) as Account['id']);
  if (id) query.where(`${Profiles.tableName}.id`, id);

  return query;
};

export async function findOne(filter: Partial<Profile>) {
  return filterQuery(Profiles.query(), filter).withGraphJoined('roles').first();
}

export async function create(profile: Partial<Profile>, tx?: Transaction) {
  return Profiles.query(tx).insert(profile);
}

export async function update({ id, ...updatedKeys }: Partial<Profile>, tx?: Transaction) {
  return Profiles.query(tx).patch(updatedKeys).where({ id }).returning('*').first();
}

export async function findEager(filter: Partial<Profile>, relations: string | string[]) {
  return filterQuery(Profiles.query(), filter).withGraphJoined(relations).first();
}
