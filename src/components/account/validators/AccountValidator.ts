import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { ajvDefaultOptions } from '../../../configs';
import { changePasswordSchema, createSchema, emailVerificationSchema, recoverySchema } from '../schemas/AccountSchema';

const ajv = new Ajv({ ...ajvDefaultOptions, $data: true });

addFormats(ajv, ['email']);

export const create = ajv.compile(createSchema);
export const emailVerification = ajv.compile(emailVerificationSchema);
export const recovery = ajv.compile(recoverySchema);
export const changePassword = ajv.compile(changePasswordSchema);
