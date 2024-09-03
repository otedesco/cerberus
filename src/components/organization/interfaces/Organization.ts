import { Profile } from '../../profile';

export interface Organization {
  id: string;
  name: string;
  collaborators: Profile[] | Profile['id'][];
  country: string;

  createdAt: string;
  updatedAt?: string;
}
