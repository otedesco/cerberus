import { Organization } from '../../organization';
import { Profile } from '../../profile';

import { RoleType } from './RoleType';

export interface Role {
  id?: number;
  role: RoleType['role'];
  profileId?: Profile['id'];
  organizationId?: Organization['id'];
  profile?: Profile;
  organization?: Organization;

  createdAt: string;
  updatedAt?: string;
}
