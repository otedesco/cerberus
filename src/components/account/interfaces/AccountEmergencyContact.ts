export interface AccountEmergencyContact {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  relationship: string;

  createdAt: Date;
  updatedAt?: Date | null;
}
