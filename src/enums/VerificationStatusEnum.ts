export const VerificationStatusEnum = {
  VERIFICATION_PENDING: 'verification_pending',
  VERIFICATION_REQUESTED: 'verification_requested',
  VERIFICATION_FAILED: 'verification_failed',
  VERIFIED: 'verified',
} as const;

export type VerificationStatusType = (typeof VerificationStatusEnum)[keyof typeof VerificationStatusEnum];
