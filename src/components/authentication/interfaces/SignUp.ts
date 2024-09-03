import { Account } from '../../account';
import { Profile } from '../../profile';

export interface SignUp extends Account, Pick<Profile, 'name' | 'lastname'> {
  passwordConfirmation: string;
}
