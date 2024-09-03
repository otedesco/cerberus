import { BaseModel, ModelObject } from '@otedesco/commons';

import { ACCOUNT_TABLE } from '../../../configs';
import { Profile } from '../../profile';
import { Account } from '../interfaces/Account';
import { AccountStatusType } from '../interfaces/AccountStatusType';
import { Session } from '../interfaces/Session';
import { modelSchema } from '../schemas/AccountSchema';

import { AccountStatusTypes } from './AccountStatusTypeModel';
import { Sessions } from './SessionsModel';

export class Accounts extends BaseModel implements Account {
  id!: string;

  email: string;

  password: string;

  salt: string;

  externalId?: string;

  status: AccountStatusType['status'];

  sessions?: Session['id'][] | Session[];

  profiles?: Profile['id'][] | Profile[];

  createdAt: string;

  static tableName = ACCOUNT_TABLE;

  static get jsonSchema() {
    return modelSchema;
  }

  static get relationMappings() {
    return {
      accountStatus: {
        relation: BaseModel.HasOneRelation,
        modelClass: AccountStatusTypes,
        join: {
          from: `${AccountStatusTypes.tableName}.status`,
          to: `${this.tableName}.status`,
        },
      },
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: Sessions,
        join: {
          from: `${Sessions.tableName}.id`,
          to: `${this.tableName}.sessions`,
        },
      },
    };
  }
}

export type AccountShape = ModelObject<Accounts>;
