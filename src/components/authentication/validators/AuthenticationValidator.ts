import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

import { ajvDefaultOptions } from '../../../configs';
import { SignIn } from '../interfaces/SignIn';
import { SignUp } from '../interfaces/SignUp';
import { AuthenticationSchema } from '../schemas';

const ajv = new Ajv({ ...ajvDefaultOptions, $data: true });
addFormats(ajv, {
  mode: 'fast',
  formats: ['email', 'password'],
  keywords: true,
});

export const signUp: ValidateFunction<SignUp> = ajv.compile(AuthenticationSchema.signUpSchema);

export const signIn: ValidateFunction<SignIn> = ajv.compile(AuthenticationSchema.signInSchema);
