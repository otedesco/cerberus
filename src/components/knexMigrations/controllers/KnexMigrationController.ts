import { Request, Response } from 'express';

import { resolveResponse } from '../../../handlers';
import { KnexMigrationService } from '../services';

export async function unlock(req: Request, res: Response): Promise<void> {
  const { requester = {} } = res.locals;
  const { status, data } = await resolveResponse(KnexMigrationService.unlock(requester));

  res.status(status).json({ data });
}

export async function list(req: Request, res: Response): Promise<void> {
  const { requester = {} } = res.locals;
  const { status, data } = await resolveResponse(KnexMigrationService.listMigrations(requester));

  res.status(status).json({ data });
}

export async function down({ body }: Request, res: Response): Promise<void> {
  const { requester = {} } = res.locals;
  const { status, data } = await resolveResponse(KnexMigrationService.down(body, requester));

  res.status(status).json({ data });
}

export async function up({ body }: Request, res: Response): Promise<void> {
  const { requester = {} } = res.locals;
  const { status, data } = await resolveResponse(KnexMigrationService.up(body, requester));

  res.status(status).json({ data });
}
