const properties = {
  id: { type: 'string', minLength: 1 },
  name: { type: 'string', minLength: 1, maxLength: 45 },
  lastname: { type: 'string', minLength: 1, maxLength: 45 },
  avatarUrl: { type: 'string', maxLength: 255, format: 'url', nullable: true },
};

export const modelSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ...properties,
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time', nullable: true },
  },
  required: [],
};

export const updateSchema = {
  type: 'object',
  additionalProperties: false,
  properties,
  required: [],
};
