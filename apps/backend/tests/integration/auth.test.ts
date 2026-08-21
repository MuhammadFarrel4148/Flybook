import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../../app.ts";
import { prisma } from "../../lib/prisma.ts";

const { verifyIdTokenMock } = vi.hoisted(() => ({
  verifyIdTokenMock: vi.fn(),
}));

vi.mock("google-auth-library", () => ({
  OAuth2Client: class {
    verifyIdToken = verifyIdTokenMock;
  },
}));

describe("POST /api/auth/register", () => {
  it("creates a new user and returns it", async () => {
    const payload = {
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "secret123",
    };

    const res = await request(app).post("/api/auth/register").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      success: true,
      data: { fullName: payload.fullName, email: payload.email },
    });
    expect(typeof res.body.data.id).toBe("string");

    const stored = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    expect(stored).not.toBeNull();
    expect(stored?.fullName).toBe(payload.fullName);
  });

  it("rejects duplicate email registration with 409", async () => {
    const payload = {
      fullName: "Jane Doe",
      email: "dup@example.com",
      password: "secret123",
    };

    const first = await request(app).post("/api/auth/register").send(payload);
    expect(first.status).toBe(201);

    const second = await request(app).post("/api/auth/register").send(payload);

    expect(second.status).toBe(409);
    expect(second.body).toEqual({
      success: false,
      error: { code: "ConflictError", message: "Email already registered" },
    });

    const count = await prisma.user.count({ where: { email: payload.email } });
    expect(count).toBe(1);
  });

  it("stores the user even without a password (no request validation exists yet)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ fullName: "No Password", email: "nopass@example.com" });

    expect(res.status).toBe(201);
  });

  it("responds 500 when email is missing (no request validation exists yet)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ fullName: "No Email", password: "secret123" });

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe("INTERNAL_ERROR");
  });
});

describe("POST /api/auth/register/sso", () => {
  function mockGooglePayload(payload: Record<string, unknown>) {
    verifyIdTokenMock.mockResolvedValue({ getPayload: () => payload });
  }

  it("creates a new user from a verified Google credential and returns it", async () => {
    mockGooglePayload({
      email_verified: true,
      name: "Jane Sso",
      email: "jane.sso@example.com",
      sub: "google-sub-123",
    });

    const res = await request(app)
      .post("/api/auth/register/sso")
      .send({ credential: "valid-google-credential" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      success: true,
      data: {
        fullName: "Jane Sso",
        email: "jane.sso@example.com",
        googleId: "google-sub-123",
      },
    });

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies?.some((cookie: string) => cookie.startsWith("token="))).toBe(
      true,
    );

    const stored = await prisma.user.findUnique({
      where: { email: "jane.sso@example.com" },
    });
    expect(stored).not.toBeNull();
    expect(stored?.googleId).toBe("google-sub-123");
  });

  it("responds 400 when no credential is provided", async () => {
    const res = await request(app).post("/api/auth/register/sso").send({});

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("BadRequestError");
  });

  it("responds 409 when the Google account's email is already registered", async () => {
    mockGooglePayload({
      email_verified: true,
      name: "Dup Sso",
      email: "dup-sso@example.com",
      sub: "google-sub-456",
    });

    await prisma.user.create({
      data: { fullName: "Dup Sso", email: "dup-sso@example.com" },
    });

    const res = await request(app)
      .post("/api/auth/register/sso")
      .send({ credential: "valid-google-credential" });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      success: false,
      error: { code: "ConflictError", message: "Email already registered" },
    });
  });
});

describe("POST /api/auth/login", () => {
  const credentials = { email: "jane@example.com", password: "secret123" };

  async function seedUser() {
    await prisma.user.create({
      data: {
        fullName: "Jane Doe",
        email: credentials.email,
        password: credentials.password,
      },
    });
  }

  it("logs in with correct credentials and sets an httpOnly token cookie", async () => {
    await seedUser();

    const res = await request(app).post("/api/auth/login").send(credentials);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Login berhasil",
    });

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies?.some((cookie: string) => cookie.startsWith("token="))).toBe(
      true,
    );
  });

  it("returns 404 when no account matches the email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "secret123" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      error: { code: "NotFoundError", message: "Account not found" },
    });
  });

  it("returns 400 when the password is wrong", async () => {
    await seedUser();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: credentials.email, password: "wrong-password" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      error: { code: "BadRequestError", message: "Email or password wrong" },
    });
  });
});
