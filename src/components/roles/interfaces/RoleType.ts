import { RoleType as RoleTypeEnum } from '../../../enums';

export interface RoleType {
  id: number;
  role: (typeof RoleTypeEnum)[keyof typeof RoleTypeEnum];
}
