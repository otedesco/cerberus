import { BaseModel, ModelObject } from '@otedesco/commons';

import { ACCOUNT_TABLE } from '../../../configs';
import { Profile, Profiles } from '../../profile';
import { AccountDetail } from '../interfaces';
import { Account } from '../interfaces/Account';
import { AccountEmergencyContact } from '../interfaces/AccountEmergencyContact'; // Import AccountEmergencyContact interface
import { Session } from '../interfaces/Session';
import { modelSchema } from '../schemas/AccountSchema';

import { AccountDetails } from './AccountDetailsModel';
import { AccountEmergencyContacts } from './AccountEmergencyContactModel';
import { Sessions } from './SessionsModel';

export class Accounts extends BaseModel implements Account {
  id!: string;

  email: string;

  password: string;

  salt: string;

  active: boolean;

  phoneNumber?: string;

  detailsId?: string;

  sessions?: Session[];

  profiles?: Profile;

  details?: AccountDetail;

  emergencyContacts?: AccountEmergencyContact[];

  createdAt: string;

  static tableName = ACCOUNT_TABLE;

  static get jsonSchema() {
    return modelSchema;
  }

  static get relationMappings() {
    return {
      details: {
        relation: BaseModel.HasOneRelation,
        modelClass: AccountDetails,
        join: {
          from: `${this.tableName}.details_id`,
          to: `${AccountDetails.tableName}.id`,
        },
      },
      emergencyContacts: {
        relation: BaseModel.HasManyRelation,
        modelClass: AccountEmergencyContacts,
        join: {
          from: `${this.tableName}.id`,
          to: `${AccountEmergencyContacts.tableName}.account_id`,
        },
      },
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: Sessions,
        join: {
          from: `${this.tableName}.id`,
          to: `${Sessions.tableName}.account_id`,
        },
      },
      profile: {
        relation: BaseModel.HasOneRelation,
        modelClass: Profiles,
        join: {
          from: `${this.tableName}.profile_id`,
          to: `${Profiles.tableName}.id`,
        },
      },
    };
  }
}

export type AccountShape = ModelObject<Accounts>;
