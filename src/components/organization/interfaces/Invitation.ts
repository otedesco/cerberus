import { RoleType } from '../../../enums/RoleTypeEnum';

import { Organization } from './Organization';

export interface Invitation {
  id?: string;
  organization: Organization['id'] | Organization;
  email: string;
  role: (typeof RoleType)[keyof typeof RoleType];
}
