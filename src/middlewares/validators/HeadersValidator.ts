import Ajv from 'ajv';

import { allHeadersSchema } from '../schemas/HeadersSchema';

const ajv = new Ajv({ allErrors: true, coerceTypes: true, verbose: true });

export const allHeaders = ajv.compile(allHeadersSchema);
