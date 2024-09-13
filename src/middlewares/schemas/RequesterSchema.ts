import { REQUESTER } from '../../configs';

export const requesterSchema = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      default: REQUESTER.userId,
    },
  },
};
