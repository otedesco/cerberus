import _ from 'lodash';
import { QueryBuilder, Transaction } from 'objection';

import { Session } from '../interfaces';
import { Sessions } from '../models';

const eagerRelations = 'account';
const fieldsToOmit = ['accountId'];

export type Filters = Partial<Session> & { showHidden?: boolean; ids?: Sessions['id'][] };

async function sanitize(query: any): Promise<Session | Session[]> {
  const results = await query;

  if (!Array.isArray(results)) return _.omit<Session>(results, fieldsToOmit) as Session;

  return _.map(results, (result) => _.omit<Session>(result, fieldsToOmit)) as Session[];
}

function resolveRelations(query: QueryBuilder<Sessions>) {
  return query.withGraphJoined(eagerRelations);
}

const filterQuery = (query: QueryBuilder<Sessions, Sessions[]>, filter: Filters) => {
  const { ids, showHidden = false, ...rest } = filter;

  if (ids) query.whereIn(`${Sessions.tableName}.id`, ids);
  if (showHidden) query.where(`${Sessions.tableName}.active`, false);

  return query.where(Sessions.mapFilter(rest));
};

const buildFindQuery = (filters: Filters, tx?: Transaction) => {
  const query = filterQuery(Sessions.query(tx), { ...filters }).orderBy('createdAt');

  return resolveRelations(query);
};

export async function findOneSimple(filters: Filters, tx?: Transaction) {
  return filterQuery(Sessions.query(tx), { ...filters }).first();
}

export function findSimple(filters: Filters, tx?: Transaction) {
  return filterQuery(Sessions.query(tx), { ...filters });
}

export async function findOne(filters: Filters, tx?: Transaction) {
  // FIXME: fix this illegal casting
  const query = filterQuery(Sessions.query(tx), { ...filters });

  return sanitize(resolveRelations(query).first());
}

export async function find(filters: Filters, tx?: Transaction) {
  return sanitize(buildFindQuery(filters, tx));
}

export async function create(session: Partial<Session>, tx?: Transaction) {
  const { id } = await Sessions.query(tx).insert(session);

  return findOne({ id });
}

export async function update({ id, data }: { id: Session['id']; data: Partial<Session> }, tx?: Transaction) {
  await Sessions.query(tx).patch(data).where({ id });

  return findOne({ id }, tx);
}
