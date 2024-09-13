import { Request, Response } from 'express';

import { resolveResponse } from '../../../handlers';
import { KnexMigrationService } from '../services';

export async function unlock(req: Request, res: Response): Promise<void> {
  const { requester = {} } = res.locals;
  const resp = await resolveResponse(KnexMigrationService.unlock(requester));

  res.status(resp.status).json(resp.data);
}

export async function list(req: Request, res: Response): Promise<void> {
  const { requester = {} } = res.locals;
  const resp = await resolveResponse(KnexMigrationService.listMigrations(requester));

  res.status(resp.status).json(resp.data);
}

export async function down({ body }: Request, res: Response): Promise<void> {
  const { requester = {} } = res.locals;
  const resp = await resolveResponse(KnexMigrationService.down(body, requester));

  res.status(resp.status).json(resp.data);
}

export async function up({ body }: Request, res: Response): Promise<void> {
  const { requester = {} } = res.locals;
  const resp = await resolveResponse(KnexMigrationService.up(body, requester));

  res.status(resp.status).json(resp.data);
}
