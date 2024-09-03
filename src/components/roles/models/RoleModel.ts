import { BaseModel, ModelObject } from '@otedesco/commons';

import { ROLE_TABLE } from '../../../configs';
import { Organization } from '../../organization';
import { Organizations } from '../../organization/models';
import { Profile } from '../../profile';
import { Profiles } from '../../profile/models';
import { Role, RoleType } from '../interfaces';

export class Roles extends BaseModel implements Role {
  id!: number;

  role: RoleType['role'];

  profile_id: Profile['id'];

  organization_id: Organization['id'];

  createdAt: string;

  static tableName: string = ROLE_TABLE;

  static get relationMappings() {
    return {
      profile: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Profiles,
        join: {
          to: `${this.tableName}.profile_id`,
          from: `${Profiles.tableName}.id`,
        },
      },
      organization: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Organizations,
        join: {
          from: `${this.tableName}.organization_id`,
          to: `${Organizations.tableName}.id`,
        },
      },
    };
  }
}

export type RoleShape = ModelObject<Roles>;
