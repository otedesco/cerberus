import { BaseModel, ModelObject } from '@otedesco/commons';

import { PROFILE_DETAILS_TABLE } from '../../../configs';
import { ProfileDetail } from '../interfaces';
import { modelSchema } from '../schemas/ProfileDetailsSchema';

import { Profiles } from './ProfileModel';

export class ProfileDetails extends BaseModel implements ProfileDetail {
  id!: string;

  location?: string;

  school?: string;

  work?: string;

  languages?: string[];

  birthdate?: Date;

  gender?: string;

  maritalStatus?: string;

  nationality?: string;

  about?: string;

  createdAt: Date;

  updatedAt?: Date | null;

  static tableName: string = PROFILE_DETAILS_TABLE;

  static get jsonSchema() {
    return modelSchema;
  }

  static get relationMappings() {
    return {
      profile: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Profiles,
        join: {
          from: `${this.tableName}.id`,
          to: `${Profiles.tableName}.details`,
        },
      },
    };
  }
}

export type ProfileDetailsShape = ModelObject<ProfileDetails>;
