import { Account } from './Account';

export interface Session {
  id: string;
  accountId: Account['id'];
  lastActivityLog?: string;
  active: boolean;

  createdAt: string;
  updatedAt?: string;
}
