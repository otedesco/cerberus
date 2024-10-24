import { Organization } from '../../organization';
import { Profile } from '../../profile';

import { RoleType } from './RoleType';

export interface Role {
  id?: string;
  role: RoleType['role'];
  avatarUrl?: string;
  profileId?: Profile['id'];
  organizationId?: Organization['id'];
  profile?: Profile;
  organization?: Organization;

  createdAt: string;
  updatedAt?: string;
}
