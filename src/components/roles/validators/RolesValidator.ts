import Ajv from 'ajv';

import { ajvDefaultOptions } from '../../../configs';
import { RoleSchema } from '../schemas';

const ajv = new Ajv({ ...ajvDefaultOptions, $data: true });

export const create = ajv.compile(RoleSchema.createSchema);
