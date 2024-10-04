import { Profile } from '.';

export interface ProfileDetail {
  id: string;
  location?: string;
  school?: string;
  work?: string;
  languages?: string[];
  birthdate?: Date;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  about?: string;

  profileId: Profile['id'];

  createdAt: Date;
  updatedAt?: Date | null;
}
