import { Account } from '../../account';
import { Role } from '../../roles';

export interface Profile {
  id: string;
  name: string;
  lastname: string;
  avatarUrl?: string;

  roles?: Role['id'][] | Role[];

  account: Account['id'] | Account;

  createdAt: string;
  updatedAt?: string;
}
