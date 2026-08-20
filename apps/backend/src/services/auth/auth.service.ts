import { ConflictError } from "../../../exceptions/ConflictError.ts";
import { NotFoundError } from "../../../exceptions/NotFoundError.ts";
import { BadRequestError } from "../../../exceptions/BadRequestError.ts";
import { authRepository } from "../../repositories/auth/auth.repository.ts";
import { generateToken } from "../../../lib/generateToken.ts";

export const authService = {
  register: async (fullName: string, email: string, password: string) => {
    const isRegister = await authRepository.findUserByEmail(email);

    if (isRegister) {
      throw new ConflictError("Email already registered");
    }

    const { id } = await authRepository.registerAccount(
      fullName,
      email,
      password,
    );
    return { id };
  },

  login: async (email: string, password: string) => {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundError("Account not found");
    }

    if (user.password !== password) {
      throw new BadRequestError("Email or password wrong");
    }

    const token = generateToken(user.id, user.email);

    return token;
  },
};
