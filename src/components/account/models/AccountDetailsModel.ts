import { BaseModel, ModelObject } from '@otedesco/commons';

import { ACCOUNT_DETAILS_TABLE } from '../../../configs';
import { VerificationStatusType } from '../../../enums';
import { Account, AccountDetail } from '../interfaces';
import { modelSchema } from '../schemas/AccountDetailsSchema';

import { Accounts } from './AccountModel';

export class AccountDetails extends BaseModel implements AccountDetail {
  id!: string;

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

  accountId: Account['id'];

  static tableName = ACCOUNT_DETAILS_TABLE;

  static get jsonSchema() {
    return modelSchema;
  }

  static get relationMappings() {
    return {
      account: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Accounts,
        join: {
          from: `${this.tableName}.id`,
          to: `${Accounts.tableName}.details`,
        },
      },
    };
  }
}

export type AccountDetailsShape = ModelObject<AccountDetails>;
