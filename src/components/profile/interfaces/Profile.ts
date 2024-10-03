import { Account } from '../../account';
import { Role } from '../../roles';
import { ProfileDetail } from '../interfaces';

export interface Profile {
  id: string;
  name: string;
  lastname: string;
  avatarUrl?: string;

  roles?: Role['id'][] | Role[];
  accountId?: Account['id'];
  account?: Account;
  detailsId?: ProfileDetail['id'];
  details?: ProfileDetail;

  createdAt: string;
  updatedAt?: string;
}
