import { AccountStatus } from 'enums';

export type AccountStatusType = {
  id: number;
  status: (typeof AccountStatus)[keyof typeof AccountStatus];
};
