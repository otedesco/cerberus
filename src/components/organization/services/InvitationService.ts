import { sign } from '@otedesco/commons';
import { notifySync } from '@otedesco/notify';
import _ from 'lodash';

import { Components, EventsByComponent, SECRET_KEY, Topics, VERIFICATION_TOKEN_EXPIRE } from '../../../configs';
import { ForbiddenException } from '../../../exceptions';
import { AccountService } from '../../account';
import { Profile } from '../../profile';
import { RoleService } from '../../roles/services';
import { Invitation, InviteCollaborator, Organization } from '../interfaces';
import { InvitationRepository } from '../repositories';
import { OrganizationService } from '../services';

const topic = Topics[Components.ORGANIZATION];
const events = EventsByComponent[Components.ORGANIZATION];

const singInvitationToken = (invitation: Invitation, organization: Organization) => {
  const token = sign(_.pick(invitation, ['email', 'role']), SECRET_KEY, { expiresIn: `${VERIFICATION_TOKEN_EXPIRE}s` });

  return { invitation: invitation.id, ...organization, token };
};

export async function create({ email, role }: InviteCollaborator, organization: Organization) {
  const account = await AccountService.findOne({ email }, true);
  const invitation = await InvitationRepository.create({ email, organization: organization.id, role });

  if (account) {
    // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
    notifySync(topic, events.InviteEvent, singInvitationToken(invitation, organization));
  } else {
    AccountService.createInvitation({ email });
  }
}

export async function accept(profile: Profile, organizationId: Organization['id'], invitationId: Invitation['id']) {
  const existingRole = await RoleService.findOne({ profileId: profile.id });
  if (existingRole) throw new ForbiddenException();

  const [invitation, organization] = await Promise.all([
    InvitationRepository.findOne({ id: invitationId }),
    OrganizationService.findOne({ id: organizationId }),
  ]);

  if (!invitation || !organization) throw new ForbiddenException();
  // TODO: update invitation status to accepted or declined
  // inside of a transaction

  return RoleService.create({ profileId: profile.id, organizationId, role: invitation.role });
}
