import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { ConflictError } from "../../../exceptions/ConflictError.ts";

vi.mock("../../services/auth/auth.service.ts", () => ({
  authService: { register: vi.fn() },
}));

import { authService } from "../../services/auth/auth.service.ts";
import { authController } from "./auth.controller.ts";

function createMockResponse() {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  const res = { status } as unknown as Response;
  return { res, status, json };
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

  it("calls authService.register with the request body and responds 200 with the created user", async () => {
    vi.mocked(authService.register).mockResolvedValue({ id: "user-1" });
    const req = { body: payload } as unknown as Request;
    const { res, status, json } = createMockResponse();

    await authController.register(req, res);

    expect(authService.register).toHaveBeenCalledWith(
      payload.fullName,
      payload.email,
      payload.password,
    );
    expect(status).toHaveBeenCalledWith(200);
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
