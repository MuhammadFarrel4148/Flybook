import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../lib/prisma.ts", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "../../../lib/prisma.ts";
import { authRepository } from "./auth.repository.ts";

const prismaMock = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
};

describe("authRepository", () => {
  beforeEach(() => {
    prismaMock.user.findUnique.mockReset();
    prismaMock.user.create.mockReset();
  });

  describe("findUserByEmail", () => {
    it("queries prisma.user.findUnique by email and returns the result", async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: "user-1" });

      const result = await authRepository.findUserByEmail("jane@example.com");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "jane@example.com" },
      });
      expect(result).toEqual({ id: "user-1" });
    });

    it("returns null when prisma finds no matching user", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await authRepository.findUserByEmail("nobody@example.com");

      expect(result).toBeNull();
    });
  });

  describe("registerAccount", () => {
    it("creates a user via prisma.user.create with the given fields", async () => {
      prismaMock.user.create.mockResolvedValue({ id: "user-1" });

      const result = await authRepository.registerAccount(
        "Jane Doe",
        "jane@example.com",
        "secret123",
      );

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: "jane@example.com",
          password: "secret123",
          fullName: "Jane Doe",
        },
        select: { id: true },
      });
      expect(result).toEqual({ id: "user-1" });
    });
  });
});
