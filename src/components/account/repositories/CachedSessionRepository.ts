import { Cache } from '@otedesco/cache';
import { Transaction } from 'objection';

import { SESSION_EXPIRE, SESSION_CACHE_ENABLED } from '../../../configs';
import { Session } from '../interfaces';
import { Accounts, Sessions } from '../models';

import { SessionRepository } from './';

const idColumns = ['id', 'accountId'];

export async function findOne(argsObject: Partial<Session>): Promise<Session> {
  return Cache.cacheSimpleResponse(idColumns, Sessions.tableName, SESSION_EXPIRE, SESSION_CACHE_ENABLED, SessionRepository.findOne, argsObject);
}

export async function update(argsObject: Partial<Session>, tx?: Transaction) {
  const resolver = (args: Partial<Session>) => SessionRepository.update({ id: args.id!, data: { ...args } }, tx);

  return Cache.invalidateCache(idColumns, Accounts.tableName, SESSION_CACHE_ENABLED, resolver, argsObject);
}
