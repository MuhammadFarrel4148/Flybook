import { ConflictError } from "../../../exceptions/ConflictError.ts";
import { authRepository } from "../../repositories/auth/auth.repository.ts";

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
};
