import { QueryBuilder, Transaction } from 'objection';

import { Organization } from '../interfaces/Organization';
import { Organizations } from '../models/OrganizationModel';

const filterQuery = (query: QueryBuilder<Organizations, Organizations[]>, filter: Partial<Organization>) => {
  const { id } = filter;

  if (id) query.where(`${Organizations.tableName}.id`, id);

  return query;
};
export async function findOne(filter: Partial<Organization>) {
  return filterQuery(Organizations.query(), filter);
}

export async function create(organization: Partial<Organization>, tx?: Transaction) {
  return Organizations.query(tx).insert(organization);
}
