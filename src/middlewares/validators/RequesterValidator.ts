import Ajv from 'ajv';

import { ajvDefaultOptions } from '../../configs';
import { requesterSchema } from '../schemas/RequesterSchema';

const ajv = new Ajv(ajvDefaultOptions);

export const requesterValidator = ajv.compile(requesterSchema);
