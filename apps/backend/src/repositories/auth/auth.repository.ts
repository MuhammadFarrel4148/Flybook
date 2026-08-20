import { prisma } from "../../../lib/prisma.ts";

export const authRepository = {
  findUserByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  registerAccount: (fullName: string, email: string, password: string) => {
    return prisma.user.create({
      data: {
        email,
        password,
        fullName,
      },
      select: {
        id: true,
      },
    });
  },
};
