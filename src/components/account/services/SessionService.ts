import { Transaction } from 'objection';

import { Account } from '../interfaces';
import { Session } from '../interfaces/Session';
import { CachedSessionRepository, SessionRepository } from '../repositories';

export async function create(payload: Partial<Session>, tx?: Transaction) {
  return SessionRepository.create(payload, tx);
}

export async function update(params: Partial<Session>, tx?: Transaction) {
  return CachedSessionRepository.update(params, tx);
}

export async function find({ id }: Account) {
  const result = await SessionRepository.findSimple({ accountId: id });

  return result;
}

export async function findOne(filter: Partial<Session>) {
  return CachedSessionRepository.findOne(filter);
}
