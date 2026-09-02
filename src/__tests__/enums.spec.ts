import { RoleType, VerificationStatusEnum } from '../enums';

describe('domain enums', () => {
  it('exposes the supported role values', () => {
    expect(Object.values(RoleType)).toEqual(['owner', 'admin', 'write', 'read_only']);
  });

  it('exposes the verification lifecycle values', () => {
    expect(Object.values(VerificationStatusEnum)).toEqual(['verification_pending', 'verification_requested', 'verification_failed', 'verified']);
  });
});
