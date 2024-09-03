export const signUpSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password', 'passwordConfirmation'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' },
    passwordConfirmation: {
      type: 'string',
      const: {
        $data: '1/password',
      },
    },
    name: { type: 'string' },
    lastname: { type: 'string' },
  },
};

export const signInSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' },
  },
};
