import { BaseModel } from '@otedesco/commons';

import { INVITATION_TABLE } from '../../../configs';
import { Invitation } from '../interfaces/Invitation';
import { Organization } from '../interfaces/Organization';

import { Organizations } from './OrganizationModel';

export class Invitations extends BaseModel implements Invitation {
  id: string;

  organization: string | Organization;

  email: string;

  role: Invitation['role'];

  static tableName = INVITATION_TABLE;

  static get relationMappings() {
    return {
      invited_to: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Organizations,
        join: {
          from: `${Organizations.tableName}.id`,
          to: `${this.tableName}.organization`,
        },
      },
    };
  }
}
