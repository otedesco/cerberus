import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { ajvDefaultOptions } from '../../../configs';
import { AccountDetailsSchema } from '../schemas';
const ajv = new Ajv({ ...ajvDefaultOptions, $data: true });

addFormats(ajv, ['email']);

export const update = ajv.compile(AccountDetailsSchema.upsertSchema);
