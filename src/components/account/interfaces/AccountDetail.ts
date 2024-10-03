import { VerificationStatusType } from 'enums';

export interface AccountDetail {
  id: string;
  emailVerificationStatus: VerificationStatusType;
  phoneVerificationStatus: VerificationStatusType;
  identityVerificationStatus: VerificationStatusType;
  legalFirstname?: string;
  legalLastname?: string;
  govermentId?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;

  createdAt: Date;
  updatedAt?: Date | null;
}
