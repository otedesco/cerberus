const properties = {
  id: { type: 'string', minLength: 1 },
  location: { type: 'string', nullable: true },
  school: { type: 'string', nullable: true },
  work: { type: 'string', nullable: true },
  languages: {
    type: 'array',
    items: { type: 'string' }, // TODO: Add enum
    nullable: true,
  },
  birthdate: { type: 'string', format: 'date', nullable: true },
  gender: { type: 'string', nullable: true },
  maritalStatus: { type: 'string', nullable: true },
  nationality: { type: 'string', nullable: true },
  about: { type: 'string', maxLength: 400, nullable: true },
  profileId: { type: 'string', minLength: 1 },
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

export const createOrUpdateSchema = {
  type: 'object',
  additionalProperties: false,
  properties,
  required: [],
};
