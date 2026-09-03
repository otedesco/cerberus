import _ from 'lodash';
import { QueryBuilder, Transaction } from 'objection';

import { Profile } from '../interfaces';
import { Profiles } from '../models';

const eagerRelations = '[roles.[organization], details]';
const fieldsToOmit = ['profileId', 'organizationId'];

async function sanitize(query: QueryBuilder<Profiles>) {
  const results = await query;

  return Array.isArray(results) ? _.map(results, (result) => _.omit(result, fieldsToOmit)) : _.omit(results, fieldsToOmit);
}

function resolveRelations(query: QueryBuilder<Profiles>) {
  return query.withGraphJoined(eagerRelations);
}

const filterQuery = (query: QueryBuilder<Profiles, Profiles[]>, filter: Partial<Profile>) => {
  const { id, accountId } = filter;

  if (accountId) query.where(`${Profiles.tableName}.account_id`, '=', accountId);
  if (id) query.where(`${Profiles.tableName}.id`, id);

  return query;
};

function buildFindQuery(filter: Partial<Profiles>, tx?: Transaction) {
  const query = filterQuery(Profiles.query(tx), filter).orderBy('createdAt');

  return resolveRelations(query);
}

export async function findOne(filter: Partial<Profile>) {
  return filterQuery(Profiles.query(), filter).withGraphJoined(eagerRelations).first();
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

export async function find(filter: Partial<Profile>, limit = 50, offset = 0, tx?: Transaction) {
  return sanitize(buildFindQuery(filter, tx).limit(limit).offset(offset));
}
