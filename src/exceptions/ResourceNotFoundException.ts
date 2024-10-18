import { CustomError, ResourceNotFoundError } from '@otedesco/commons';

export class ResourceNotFoundException extends Error implements CustomError {
  public status: number;

  public code: string;

  public message: string;

  public data: object | null;

  constructor(properties?: { status?: number; code?: string; data?: object | null }) {
    const { status = 404, code = ResourceNotFoundError.code, data = null } = properties ?? {};
    super(ResourceNotFoundError.code);
    this.status = status;
    this.code = code;
    this.message = ResourceNotFoundError.message;
    this.data = data;
  }
}
