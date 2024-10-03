import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { ajvDefaultOptions } from '../../../configs';
import { ProfileDetailsSchema } from '../schemas';

const ajv = new Ajv({ ...ajvDefaultOptions, $data: true });

addFormats(ajv, ['date', 'date-time']);

// TODO: FIX TYPINGS
export const createOrUpdate = ajv.compile(ProfileDetailsSchema.createOrUpdateSchema);
