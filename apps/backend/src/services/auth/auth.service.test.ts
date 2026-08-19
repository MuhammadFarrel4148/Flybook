import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConflictError } from "../../../exceptions/ConflictError.ts";

vi.mock("../../repositories/auth/auth.repository.ts", () => ({
  authRepository: {
    findUserByEmail: vi.fn(),
    registerAccount: vi.fn(),
  },
}));

import { authRepository } from "../../repositories/auth/auth.repository.ts";
import { authService } from "./auth.service.ts";

describe("authService.register", () => {
  beforeEach(() => {
    vi.mocked(authRepository.findUserByEmail).mockReset();
    vi.mocked(authRepository.registerAccount).mockReset();
  });

  it("registers a new account when the email is not taken", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(null);
    vi.mocked(authRepository.registerAccount).mockResolvedValue({
      id: "user-1",
    });

    const result = await authService.register(
      "Jane Doe",
      "jane@example.com",
      "secret123",
    );

    expect(authRepository.findUserByEmail).toHaveBeenCalledWith(
      "jane@example.com",
    );
    expect(authRepository.registerAccount).toHaveBeenCalledWith(
      "Jane Doe",
      "jane@example.com",
      "secret123",
    );
    expect(result).toEqual({ id: "user-1" });
  });

  it("throws ConflictError and skips registerAccount when the email already exists", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue({
      id: "existing-user",
    });

    await expect(
      authService.register("Jane Doe", "jane@example.com", "secret123"),
    ).rejects.toBeInstanceOf(ConflictError);
    await expect(
      authService.register("Jane Doe", "jane@example.com", "secret123"),
    ).rejects.toMatchObject({
      message: "Email already registered",
      statusCode: 409,
    });
    expect(authRepository.registerAccount).not.toHaveBeenCalled();
  });
});
