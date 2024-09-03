import { BaseModel, ModelObject } from '@otedesco/commons';

import { SESSION_TABLE } from '../../../configs';
import { Account } from '../interfaces/Account';
import { Session } from '../interfaces/Session';

import { Accounts } from './AccountModel';

export class Sessions extends BaseModel implements Session {
  id!: string;

  accountId: Account['id'];

  active: boolean;

  createdAt: string;

  lastActivityLog?: string;

  static tableName = SESSION_TABLE;

  static mapFilter(filter: Record<any, any>) {
    return Object.keys(filter).reduce((obj, key) => ({ ...obj, [`${this.tableName}.${key}`]: filter[String(key)] }), {});
  }

  static get relationMappings() {
    return {
      account: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Accounts,
        join: {
          to: `${this.tableName}.account_id`,
          from: `${Accounts.tableName}.id`,
        },
      },
    };
  }
}

export type SessionsShape = ModelObject<Sessions>;
