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
  const result = await SessionRepository.find({ accountId: id });

  return result;
}
