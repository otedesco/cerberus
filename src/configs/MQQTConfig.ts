import { config } from 'dotenv';

import { APP_NAME } from './AppConfig';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREATED = 'added';
export const RECOVERY = 'recovery';
export const UPDATED = 'updated';
export const DELETED = 'deleted';
export const INVITE = 'invite';

const Actions = {
  CREATED: 'added',
  UPDATED: 'updated',
  DELETED: 'deleted',
  RECOVERY: 'recovery',
  INVITE: 'invite',
} as const;

export const Components = {
  ACCOUNT: 'account',
  PROFILE: 'profile',
  ORGANIZATION: 'organization',
  ROLE: 'role',
} as const;

export const Topics = {
  [Components.ACCOUNT]: `${APP_NAME}_${Components.ACCOUNT}_topic`,
  [Components.PROFILE]: `${APP_NAME}_${Components.PROFILE}_topic`,
  [Components.ORGANIZATION]: `${APP_NAME}_${Components.ORGANIZATION}_topic`,
  [Components.ROLE]: `${APP_NAME}_${Components.ROLE}_topic`,
} as const;

export const EventsByComponent = {
  [Components.ACCOUNT]: {
    CreatedEvent: `${APP_NAME}_${Components.ACCOUNT}_${Actions.CREATED}`,
    RecoveryEvent: `${APP_NAME}_${Components.ACCOUNT}_${Actions.RECOVERY}`,
    UpdatedEvent: `${APP_NAME}_${Components.ACCOUNT}_${Actions.UPDATED}`,
    deletedEvent: `${APP_NAME}_${Components.ACCOUNT}_${Actions.DELETED}`,
    InviteEvent: `${APP_NAME}_${Components.ACCOUNT}_${Actions.INVITE}`,
  },
  [Components.ORGANIZATION]: {
    CreatedEvent: `${APP_NAME}_${Components.ORGANIZATION}_${Actions.CREATED}`,
    UpdatedEvent: `${APP_NAME}_${Components.ORGANIZATION}_${Actions.UPDATED}`,
    deletedEvent: `${APP_NAME}_${Components.ORGANIZATION}_${Actions.DELETED}`,
    InviteEvent: `${APP_NAME}_${Components.ORGANIZATION}_${Actions.INVITE}`,
  },
  [Components.PROFILE]: {
    CreatedEvent: `${APP_NAME}_${Components.PROFILE}_${Actions.CREATED}`,
    UpdatedEvent: `${APP_NAME}_${Components.PROFILE}_${Actions.UPDATED}`,
    deletedEvent: `${APP_NAME}_${Components.PROFILE}_${Actions.DELETED}`,
  },
  [Components.ROLE]: {
    CreatedEvent: `${APP_NAME}_${Components.ROLE}_${Actions.CREATED}`,
    UpdatedEvent: `${APP_NAME}_${Components.ROLE}_${Actions.UPDATED}`,
    deletedEvent: `${APP_NAME}_${Components.ROLE}_${Actions.DELETED}`,
  },
} as const;
