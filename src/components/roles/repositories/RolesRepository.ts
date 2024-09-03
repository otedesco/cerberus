import _ from 'lodash';
import { QueryBuilder, Transaction } from 'objection';

import { Role } from '../interfaces';
import { Roles } from '../models';

const eagerRelations = '[profile, organization]';
const fieldsToOmit = ['profileId', 'organizationId'];

async function sanitize(query: QueryBuilder<Roles>) {
  const results = await query;

  return Array.isArray(results) ? _.map(results, (result) => _.omit(result, fieldsToOmit)) : _.omit(results, fieldsToOmit);
}

function resolveRelations(query: QueryBuilder<Roles>) {
  return query.withGraphJoined(eagerRelations);
}

function filterQuery(query: QueryBuilder<Roles>, filter: Partial<Role>) {
  const { id, organizationId, profileId } = filter;

  if (profileId) query.where('profile_id', profileId);
  if (organizationId) query.where('organization_id', organizationId);
  if (id) query.where('id', id);

  return query;
}

function buildFindQuery(filter: Partial<Role>) {
  const query = filterQuery(Roles.query(), filter).orderBy('createdAt');

  return resolveRelations(query);
}

export function findSimple(filter: Partial<Role>, tx?: Transaction) {
  return filterQuery(Roles.query(tx), filter);
}

export function findOneSimple(filter: Partial<Role>, tx?: Transaction) {
  return filterQuery(Roles.query(tx), filter).first();
}

export async function findOne(filter: Partial<Role>, tx?: Transaction) {
  // FIXME: fix this illegal casting
  const query = findOneSimple(filter, tx) as unknown as QueryBuilder<Roles>;

  return sanitize(resolveRelations(query));
}

export async function find(filter: Partial<Role>, limit = 50, offset = 0) {
  return sanitize(buildFindQuery(filter).limit(limit).offset(offset));
}

export async function create(role: Partial<Role>, tx?: Transaction) {
  const { id } = await Roles.query(tx).insert(role);

  return findOneSimple({ id }, tx);
}
