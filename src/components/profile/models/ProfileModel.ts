import { BaseModel, ModelObject } from '@otedesco/commons';

import { PROFILE_TABLE } from '../../../configs';
import { Account } from '../../account';
import { Accounts } from '../../account/models';
import { Role } from '../../roles';
import { Roles } from '../../roles/models';
import { Profile, ProfileDetail } from '../interfaces';

import { ProfileDetails } from './ProfileDetailsModel';

export class Profiles extends BaseModel implements Profile {
  id!: string;

  name: string;

  lastname: string;

  avatarUrl?: string;

  roles: Role['id'][] | Role[];

  accountId: Account['id'];

  detailsId?: ProfileDetail['id'];

  createdAt: string;

  static tableName: string = PROFILE_TABLE;

  static get relationMappings() {
    return {
      roles: {
        relation: BaseModel.HasManyRelation,
        modelClass: Roles,
        join: {
          from: `${this.tableName}.id`,
          to: `${Roles.tableName}.profile_id`,
        },
      },
      details: {
        relation: BaseModel.HasOneRelation,
        modelClass: ProfileDetails,
        join: {
          from: `${this.tableName}.details_id`,
          to: `${ProfileDetails.tableName}.id`,
        },
      },
      accounts: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Accounts,
        join: {
          from: `${Accounts.tableName}.id`,
          to: `${this.tableName}.account`,
        },
      },
    };
  }
}

export type ProfilesShape = ModelObject<Profiles>;
