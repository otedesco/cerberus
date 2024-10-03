import { BaseModel, ModelObject } from '@otedesco/commons';

import { ACCOUNT_EMERGENCY_CONTACT_TABLE } from '../../../configs';
import { AccountEmergencyContact } from '../interfaces';
import { modelSchema } from '../schemas/AccountEmergencyContactSchema';

import { Accounts } from './AccountModel'; // Import the Accounts model to define the relationship

export class AccountEmergencyContacts extends BaseModel implements AccountEmergencyContact {
  id!: string;

  name: string;

  phoneNumber?: string;

  email?: string;

  relationship: string;

  account!: string;

  createdAt: Date;

  updatedAt?: Date | null;

  static tableName = ACCOUNT_EMERGENCY_CONTACT_TABLE;

  static get jsonSchema() {
    return modelSchema;
  }

  static get relationMappings() {
    return {
      account: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Accounts,
        join: {
          from: `${this.tableName}.account`,
          to: `${Accounts.tableName}.id`,
        },
      },
    };
  }
}

export type AccountEmergencyContactsShape = ModelObject<AccountEmergencyContacts>;
