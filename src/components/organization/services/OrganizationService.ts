import { notify } from '@otedesco/notify';
import { Promise } from 'bluebird';
import { Transaction } from 'objection';

import { Components, EventsByComponent, Topics } from '../../../configs';
import { RoleType } from '../../../enums';
import { ForbiddenException, InternalServerException } from '../../../exceptions';
import { Transaction as Transactional } from '../../../utils';
import { Account } from '../../account';
import { ProfileService } from '../../profile';
import { Role, RoleService } from '../../roles';
import { Organization, InviteCollaborator, Invitation } from '../interfaces';
import { CachedOrganizationRepository as Repository } from '../repositories';

import * as InvitationService from './InvitationService';

const topic = Topics[Components.ORGANIZATION];
const events = EventsByComponent[Components.ORGANIZATION];

export async function create(account: Account, payload: Partial<Organization>): Promise<void> {
  const profile = await ProfileService.findOne({ account: account.id });
  if (!profile) throw new InternalServerException();

  return Transactional.run(async (tx: Transaction) => {
    const organization = await Repository.create(payload, tx);
    const role = await RoleService.create({ profileId: profile.id, organizationId: organization.id, role: RoleType.OWNER }, tx);
    notify(topic, events.CreatedEvent, { organization, account, profile, role });
  });
}

export async function inviteCollaborator(payload: InviteCollaborator[], { organization }: Role) {
  if (!organization) throw new ForbiddenException();

  return Promise.map(payload, (invitation: Invitation) => InvitationService.create(invitation, organization as Organization), {
    concurrency: payload.length,
  });
}

export async function findOne(filter: Partial<Organization>) {
  return Repository.findOne(filter);
}
