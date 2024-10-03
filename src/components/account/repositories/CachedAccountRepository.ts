import { Cache } from '@otedesco/cache';
import { Transaction } from 'objection';

import { SESSION_EXPIRE, ACCOUNT_CACHE_ENABLED } from '../../../configs';
import { Account } from '../interfaces';
import { Accounts } from '../models';

import { AccountRepository } from './';

const idColumns = ['email'];

export async function findOne(argsObject: Partial<Account>): Promise<Account> {
  return Cache.cacheSimpleResponse(idColumns, Accounts.tableName, SESSION_EXPIRE, ACCOUNT_CACHE_ENABLED, AccountRepository.findOne, argsObject);
}

export async function create(argsObject: Partial<Account>, tx?: Transaction) {
  return Cache.invalidateCache(idColumns, Accounts.tableName, ACCOUNT_CACHE_ENABLED, (args) => AccountRepository.create(args, tx), argsObject);
}

export async function update(argsObject: Partial<Account>, tx?: Transaction) {
  const resolver = (args: Partial<Account>) => AccountRepository.update(args, tx);

  return Cache.invalidateCache(idColumns, Accounts.tableName, ACCOUNT_CACHE_ENABLED, resolver, argsObject);
}
