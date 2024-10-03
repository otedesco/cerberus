import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

import { ajvDefaultOptions } from '../../../configs';
import { InviteCollaborator } from '../interfaces';
import { CreateOrganization } from '../interfaces/CreateOrganization';
import { OrganizationSchema } from '../schemas';

const ajv = new Ajv({ ...ajvDefaultOptions, $data: true });
addFormats(ajv, {
  mode: 'fast',
  keywords: true,
});

export const createOrganizationSchema: ValidateFunction<CreateOrganization> = ajv.compile(OrganizationSchema.createSchema);
export const inviteCollaboratorSchema: ValidateFunction<InviteCollaborator> = ajv.compile(OrganizationSchema.inviteSchema);
