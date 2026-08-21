import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { ConflictError } from "../../../exceptions/ConflictError.ts";
import { NotFoundError } from "../../../exceptions/NotFoundError.ts";

vi.mock("../../services/auth/auth.service.ts", () => ({
  authService: { register: vi.fn(), registerSso: vi.fn(), login: vi.fn() },
}));

import { authService } from "../../services/auth/auth.service.ts";
import { authController } from "./auth.controller.ts";

function createMockResponse() {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  const cookie = vi.fn();
  const res = { status, cookie } as unknown as Response;
  cookie.mockReturnValue(res);
  return { res, status, json, cookie };
}

const payload = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  password: "secret123",
};

describe("authController.register", () => {
  beforeEach(() => {
    vi.mocked(authService.register).mockReset();
  });

  it("calls authService.register with the request body and responds 201 with the created user", async () => {
    vi.mocked(authService.register).mockResolvedValue({ id: "user-1" });
    const req = { body: payload } as unknown as Request;
    const { res, status, json } = createMockResponse();

    await authController.register(req, res);

    expect(authService.register).toHaveBeenCalledWith(
      payload.fullName,
      payload.email,
      payload.password,
    );
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      success: true,
      message: "Registrasi berhasil, silahkan lakukan login",
      data: { id: "user-1", fullName: payload.fullName, email: payload.email },
    });
  });

  it("propagates the error from authService and never responds when registration fails", async () => {
    const error = new ConflictError("Email already registered");
    vi.mocked(authService.register).mockRejectedValue(error);
    const req = { body: payload } as unknown as Request;
    const { res, status, json } = createMockResponse();

    await expect(authController.register(req, res)).rejects.toBeInstanceOf(
      ConflictError,
    );
    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
  });
});

const ssoPayload = { credential: "google-credential-token" };

describe("authController.registerSso", () => {
  beforeEach(() => {
    vi.mocked(authService.registerSso).mockReset();
  });

  it("calls authService.registerSso with the credential, sets the token cookie, and responds 201 with the created user", async () => {
    vi.mocked(authService.registerSso).mockResolvedValue({
      id: "user-1",
      fullName: "Jane Doe",
      email: "jane@example.com",
      googleId: "google-sub-123",
      token: "signed-token",
    });
    const req = { body: ssoPayload } as unknown as Request;
    const { res, status, json, cookie } = createMockResponse();

    await authController.registerSso(req, res);

    expect(authService.registerSso).toHaveBeenCalledWith(ssoPayload.credential);
    expect(cookie).toHaveBeenCalledWith("token", "signed-token", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      success: true,
      message: "Registrasi berhasil",
      data: {
        id: "user-1",
        fullName: "Jane Doe",
        email: "jane@example.com",
        googleId: "google-sub-123",
      },
    });
  });

  it("propagates the error from authService and never sets a cookie or responds when SSO registration fails", async () => {
    const error = new ConflictError("Email already registered");
    vi.mocked(authService.registerSso).mockRejectedValue(error);
    const req = { body: ssoPayload } as unknown as Request;
    const { res, status, json, cookie } = createMockResponse();

    await expect(authController.registerSso(req, res)).rejects.toBeInstanceOf(
      ConflictError,
    );
    expect(cookie).not.toHaveBeenCalled();
    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
  });
});

const loginPayload = {
  email: "jane@example.com",
  password: "secret123",
};

describe("authController.login", () => {
  beforeEach(() => {
    vi.mocked(authService.login).mockReset();
  });

  it("calls authService.login with the request body, sets the token cookie, and responds 200", async () => {
    vi.mocked(authService.login).mockResolvedValue("signed-token");
    const req = { body: loginPayload } as unknown as Request;
    const { res, status, json, cookie } = createMockResponse();

    await authController.login(req, res);

    expect(authService.login).toHaveBeenCalledWith(
      loginPayload.email,
      loginPayload.password,
    );
    expect(cookie).toHaveBeenCalledWith("token", "signed-token", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      success: true,
      message: "Login berhasil",
    });
  });

  it("propagates the error from authService and never sets a cookie or responds when login fails", async () => {
    const error = new NotFoundError("Account not found");
    vi.mocked(authService.login).mockRejectedValue(error);
    const req = { body: loginPayload } as unknown as Request;
    const { res, status, json, cookie } = createMockResponse();

    await expect(authController.login(req, res)).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(cookie).not.toHaveBeenCalled();
    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
  });
});
