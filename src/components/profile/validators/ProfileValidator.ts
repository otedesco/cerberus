import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { ajvDefaultOptions } from '../../../configs';
import { ProfileSchema } from '../schemas';

const ajv = new Ajv({ ...ajvDefaultOptions, $data: true });

addFormats(ajv, ['date-time', 'url']);

// TODO: FIX TYPINGS
export const update = ajv.compile(ProfileSchema.updateSchema);
