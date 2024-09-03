import { Organization } from './Organization';

export interface CreateOrganization extends Partial<Organization> {
  name: string;
  country: string;
}
