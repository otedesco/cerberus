import { API_KEY_HEADER, USER_ID_HEADER } from '../../configs';

const commonStringProperties = {
  type: 'string',
  maxLength: 300,
  minLength: 1,
};

export const apiKey = { ...commonStringProperties };

export const userId = { ...commonStringProperties };

export const allHeadersSchema = {
  type: 'object',
  required: [USER_ID_HEADER, API_KEY_HEADER],
  properties: {
    [USER_ID_HEADER]: userId,
    [API_KEY_HEADER]: apiKey,
  },
};
