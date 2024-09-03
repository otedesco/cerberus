import { BaseModel, ModelObject } from '@otedesco/commons';

import { ACCOUNT_STATUS_TYPE_TABLE } from '../../../configs';
import { AccountStatusType } from '../interfaces/AccountStatusType';
import { modelSchema } from '../schemas/AccountStatusType';

export class AccountStatusTypes extends BaseModel implements AccountStatusType {
  id!: number;

  status: AccountStatusType['status'];

  static get tableName() {
    return ACCOUNT_STATUS_TYPE_TABLE;
  }

  static get jsonSchema() {
    return modelSchema;
  }
}

export type AccountStatusTypesShape = ModelObject<AccountStatusTypes>;
