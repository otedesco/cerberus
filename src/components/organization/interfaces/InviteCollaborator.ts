import { RoleType } from '../../../enums';

export interface InviteCollaborator {
  email: string;
  role: (typeof RoleType)[keyof typeof RoleType];
}
