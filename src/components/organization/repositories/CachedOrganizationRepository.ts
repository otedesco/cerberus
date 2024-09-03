import { Cache } from '@otedesco/cache';
import { Transaction } from 'objection';

import { ORGANIZATION_CACHE_ENABLED, TTL } from '../../../configs';
import { Organization } from '../interfaces';
import { Organizations } from '../models';

import * as Repository from './OrganizationRepository';

const idColumns = ['name', 'country'];

export async function create(argsObject: Partial<Organization>, tx?: Transaction) {
  return Cache.invalidateCache(idColumns, Organizations.tableName, ORGANIZATION_CACHE_ENABLED, (args) => Repository.create(args, tx), argsObject);
}

export async function findOne(argsObject: Partial<Organization>) {
  return Cache.cacheSimpleResponse(idColumns, Organizations.tableName, TTL, ORGANIZATION_CACHE_ENABLED, Repository.findOne, argsObject);
}
