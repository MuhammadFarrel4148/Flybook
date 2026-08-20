import { ClientError } from "./ClientError.ts";

export class BadRequestError extends ClientError {
  constructor(message: string) {
    super(message, 400);
  }
}
