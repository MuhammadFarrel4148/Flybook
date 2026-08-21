import { prisma } from "../../../lib/prisma.ts";

export const authRepository = {
  findUserByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  registerAccount: ({
    fullName,
    email,
    password,
    googleId,
  }: registerAccountProps) => {
    return prisma.user.create({
      data: {
        email,
        password,
        googleId,
        fullName,
      },
      select: {
        id: true,
      },
    });
  },
};

interface registerAccountProps {
  fullName: string;
  email: string;
  password?: string | undefined;
  googleId?: string | undefined;
}
