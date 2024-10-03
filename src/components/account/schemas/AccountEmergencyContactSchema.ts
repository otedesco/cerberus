const properties = {
  id: { type: 'string', minLength: 1 },
  name: { type: 'string', minLength: 1 },
  phoneNumber: { type: 'string', nullable: true },
  email: { type: 'string', format: 'email', nullable: true },
  relationship: { type: 'string', minLength: 1 },
};

export const modelSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ...properties,
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time', nullable: true },
  },
  required: ['id', 'name', 'relationship', 'createdAt'],
};
