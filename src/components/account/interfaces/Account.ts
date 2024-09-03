import { Profile } from '../../profile';

import { AccountStatusType } from './AccountStatusType';
import { Session } from './Session';

export interface Account {
  id: string;
  email: string;
  password: string;
  salt: string;
  status: AccountStatusType['status'];
  sessions?: Session['id'][] | Session[];
  profiles?: Profile['id'][] | Profile[];

  createdAt: string;
  updatedAt?: string;
}

export type SecuredAccount = Omit<Account, 'password' | 'salt'> & { token?: string; signed_session?: string };
