import { BaseModel, ModelObject } from '@otedesco/commons';

import { ORGANIZATION_TABLE } from '../../../configs';
import { Profile, Profiles } from '../../profile';
import { Organization } from '../interfaces/Organization';

export class Organizations extends BaseModel implements Organization {
  id: string;

  name: string;

  collaborators: Profile[] | Profile['id'][];

  balance: number;

  country: string;

  createdAt: string;

  static tableName = ORGANIZATION_TABLE;

  static get relationMappings() {
    return {
      profiles: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Profiles,
        join: {
          from: `${Profiles.tableName}.profile`,
          to: `${this.tableName}.collaborators`,
        },
      },
    };
  }
}

export type OrganizationShape = ModelObject<Organizations>;
