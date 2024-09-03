import { Cache } from '@otedesco/cache';
import { Transaction } from 'objection';

import { PROFILE_CACHE_ENABLED, TTL } from '../../../configs';
import { Profile } from '../interfaces/Profile';
import { Profiles } from '../models';

import * as Repository from './ProfileRepository';

const idColumns = ['account'];

export async function findOne(argsObject: Partial<Profile>): Promise<Profile | undefined> {
  return Cache.cacheSimpleResponse(idColumns, Profiles.tableName, TTL, PROFILE_CACHE_ENABLED, Repository.findOne, argsObject);
}

export async function create(argsObject: Partial<Profile>, tx?: Transaction): Promise<Profile> {
  return Cache.cacheSimpleResponse(idColumns, Profiles.tableName, TTL, PROFILE_CACHE_ENABLED, (args) => Repository.create(args, tx), argsObject);
}

export async function update(argsObject: Partial<Profile>, tx?: Transaction): Promise<Profile | undefined> {
  return Cache.invalidateCache(idColumns, Profiles.tableName, PROFILE_CACHE_ENABLED, (args) => Repository.update(args, tx), argsObject);
}
