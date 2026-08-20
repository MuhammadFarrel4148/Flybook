import { ClientError } from "./ClientError.ts";

export class ConflictError extends ClientError {
  constructor(message: string) {
    super(message, 409);
  }
}
