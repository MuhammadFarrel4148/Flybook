import { ClientError } from "./ClientError.ts";

export class NotFoundError extends ClientError {
  constructor(message: string) {
    super(message, 404);
  }
}
