import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConflictError } from "../../../exceptions/ConflictError.ts";
import { NotFoundError } from "../../../exceptions/NotFoundError.ts";
import { BadRequestError } from "../../../exceptions/BadRequestError.ts";

vi.mock("../../repositories/auth/auth.repository.ts", () => ({
  authRepository: {
    findUserByEmail: vi.fn(),
    registerAccount: vi.fn(),
  },
}));

vi.mock("../../../lib/generateToken.ts", () => ({
  generateToken: vi.fn(),
}));

const { verifyIdTokenMock } = vi.hoisted(() => ({
  verifyIdTokenMock: vi.fn(),
}));

vi.mock("google-auth-library", () => ({
  OAuth2Client: class {
    verifyIdToken = verifyIdTokenMock;
  },
}));

import { authRepository } from "../../repositories/auth/auth.repository.ts";
import { generateToken } from "../../../lib/generateToken.ts";
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
    expect(authRepository.registerAccount).toHaveBeenCalledWith({
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "secret123",
    });
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

describe("authService.registerSso", () => {
  beforeEach(() => {
    vi.mocked(authRepository.findUserByEmail).mockReset();
    vi.mocked(authRepository.registerAccount).mockReset();
    vi.mocked(generateToken).mockReset();
    verifyIdTokenMock.mockReset();
  });

  it("registers a new account from a verified Google credential and issues a token", async () => {
    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => ({
        email_verified: true,
        name: "Jane Doe",
        email: "jane@example.com",
        sub: "google-sub-123",
      }),
    });
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(null);
    vi.mocked(authRepository.registerAccount).mockResolvedValue({
      id: "user-1",
    });
    vi.mocked(generateToken).mockReturnValue("signed-token");

    const result = await authService.registerSso("valid-credential");

    expect(verifyIdTokenMock).toHaveBeenCalledWith({
      idToken: "valid-credential",
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    expect(authRepository.registerAccount).toHaveBeenCalledWith({
      fullName: "Jane Doe",
      email: "jane@example.com",
      googleId: "google-sub-123",
    });
    expect(generateToken).toHaveBeenCalledWith("user-1", "jane@example.com");
    expect(result).toEqual({
      id: "user-1",
      fullName: "Jane Doe",
      email: "jane@example.com",
      googleId: "google-sub-123",
      token: "signed-token",
    });
  });

  it("throws BadRequestError and skips token verification when credential is missing", async () => {
    await expect(authService.registerSso("")).rejects.toBeInstanceOf(
      BadRequestError,
    );
    expect(verifyIdTokenMock).not.toHaveBeenCalled();
  });

  it("throws BadRequestError when the Google email is not verified", async () => {
    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => ({
        email_verified: false,
        name: "Jane Doe",
        email: "jane@example.com",
        sub: "google-sub-123",
      }),
    });

    await expect(
      authService.registerSso("valid-credential"),
    ).rejects.toBeInstanceOf(BadRequestError);
    expect(authRepository.registerAccount).not.toHaveBeenCalled();
  });

  it("throws ConflictError and skips registerAccount when the email already exists", async () => {
    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => ({
        email_verified: true,
        name: "Jane Doe",
        email: "jane@example.com",
        sub: "google-sub-123",
      }),
    });
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue({
      id: "existing-user",
    });

    await expect(
      authService.registerSso("valid-credential"),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(authRepository.registerAccount).not.toHaveBeenCalled();
  });
});

describe("authService.login", () => {
  beforeEach(() => {
    vi.mocked(authRepository.findUserByEmail).mockReset();
    vi.mocked(generateToken).mockReset();
  });

  it("returns a token when the email and password match", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue({
      id: "user-1",
      email: "jane@example.com",
      password: "secret123",
    });
    vi.mocked(generateToken).mockReturnValue("signed-token");

    const result = await authService.login("jane@example.com", "secret123");

    expect(authRepository.findUserByEmail).toHaveBeenCalledWith(
      "jane@example.com",
    );
    expect(generateToken).toHaveBeenCalledWith("user-1", "jane@example.com");
    expect(result).toBe("signed-token");
  });

  it("throws NotFoundError when no account matches the email", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(null);

    await expect(
      authService.login("nobody@example.com", "secret123"),
    ).rejects.toBeInstanceOf(NotFoundError);
    await expect(
      authService.login("nobody@example.com", "secret123"),
    ).rejects.toMatchObject({
      message: "Account not found",
      statusCode: 404,
    });
    expect(generateToken).not.toHaveBeenCalled();
  });

  it("throws BadRequestError when the password does not match", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue({
      id: "user-1",
      email: "jane@example.com",
      password: "secret123",
    });

    await expect(
      authService.login("jane@example.com", "wrong-password"),
    ).rejects.toBeInstanceOf(BadRequestError);
    await expect(
      authService.login("jane@example.com", "wrong-password"),
    ).rejects.toMatchObject({
      message: "Email or password wrong",
      statusCode: 400,
    });
    expect(generateToken).not.toHaveBeenCalled();
  });
});
