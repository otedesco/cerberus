import { Profile } from '../../profile';

import { AccountDetail } from './AccountDetail';
import { AccountEmergencyContact } from './AccountEmergencyContact';
import { Session } from './Session';

export interface Account {
  id: string;
  email: string;
  password: string;
  salt: string;
  active: boolean;
  detailsId?: string;
  phoneNumber?: string;
  sessions?: Session[];
  profile?: Profile;
  details?: AccountDetail;
  emergencyContacts?: AccountEmergencyContact[];

  createdAt: string;
  updatedAt?: string;
}

export type SecuredAccount = Omit<Account, 'password' | 'salt'> & { token?: string; signedSession?: string; otp?: string };

// FIXME: Move this to authentication component
export type SignedSession = { accessToken: string; refreshToken: string };
