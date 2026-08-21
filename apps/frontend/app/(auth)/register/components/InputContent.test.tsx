import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Providers from "@/app/providers";
import InputForm from "./InputContent";

vi.mock("@react-oauth/google", () => ({
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  GoogleLogin: ({
    onSuccess,
  }: {
    onSuccess: (response: { credential?: string }) => void;
  }) => (
    <div>
      <button
        onClick={() => onSuccess({ credential: "fake-google-credential" })}
      >
        Mock Google Login
      </button>
      <button onClick={() => onSuccess({})}>
        Mock Google Login (no credential)
      </button>
    </div>
  ),
}));

function mockFetchOnce(response: {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderForm() {
  return render(
    <Providers>
      <InputForm />
    </Providers>,
  );
}

function fillForm({
  fullName = "Jane Doe",
  email = "jane@example.com",
  password = "secret123",
  confirmPassword = "secret123",
}: Partial<
  Record<"fullName" | "email" | "password" | "confirmPassword", string>
> = {}) {
  fireEvent.change(screen.getByLabelText("Full Name"), {
    target: { value: fullName },
  });
  fireEvent.change(screen.getByLabelText("Email Address"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText("Confirm Password"), {
    target: { value: confirmPassword },
  });
}

describe("InputForm (register)", () => {
  it("shows a pending state then a success message on successful submit", async () => {
    let resolveFetch!: (value: {
      ok: boolean;
      status: number;
      json: () => Promise<unknown>;
    }) => void;
    const fetchPromise = new Promise<{
      ok: boolean;
      status: number;
      json: () => Promise<unknown>;
    }>((resolve) => {
      resolveFetch = resolve;
    });
    const fetchMock = vi.fn().mockReturnValue(fetchPromise);
    vi.stubGlobal("fetch", fetchMock);

    renderForm();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /creating/i })).toBeDisabled(),
    );

    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "ok",
        data: { id: "1", fullName: "Jane Doe", email: "jane@example.com" },
      }),
    });

    await waitFor(() =>
      expect(
        screen.getByText("Akun berhasil dibuat, silahkan login."),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).not.toBeDisabled();
  });

  it("shows the server error message when registration fails", async () => {
    mockFetchOnce({
      ok: false,
      status: 409,
      json: async () => ({
        success: false,
        error: { code: "ConflictError", message: "Email already registered" },
      }),
    });

    renderForm();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() =>
      expect(screen.getByText("Email already registered")).toBeInTheDocument(),
    );
  });

  it("submits only fullName/email/password, excluding confirmPassword", async () => {
    const fetchMock = mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "ok",
        data: { id: "1", fullName: "Jane Doe", email: "jane@example.com" },
      }),
    });

    renderForm();
    fillForm({ password: "secret123", confirmPassword: "different456" });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(options.body as string)).toEqual({
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "secret123",
    });
  });
});

describe("InputForm (register) — Google SSO", () => {
  it("shows a pending state then a success message on successful SSO sign-up", async () => {
    let resolveFetch!: (value: {
      ok: boolean;
      status: number;
      json: () => Promise<unknown>;
    }) => void;
    const fetchPromise = new Promise<{
      ok: boolean;
      status: number;
      json: () => Promise<unknown>;
    }>((resolve) => {
      resolveFetch = resolve;
    });
    const fetchMock = vi.fn().mockReturnValue(fetchPromise);
    vi.stubGlobal("fetch", fetchMock);

    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Mock Google Login" }));

    await waitFor(() =>
      expect(screen.getByText("Signing up...")).toBeInTheDocument(),
    );

    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "ok",
        data: {
          id: "1",
          fullName: "Jane Doe",
          email: "jane@example.com",
          googleId: "google-sub-123",
        },
      }),
    });

    await waitFor(() =>
      expect(
        screen.getByText("Akun berhasil dibuat, kamu sudah login."),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByText("Signing up...")).not.toBeInTheDocument();
  });

  it("shows the server error message when SSO registration fails", async () => {
    mockFetchOnce({
      ok: false,
      status: 409,
      json: async () => ({
        success: false,
        error: { code: "ConflictError", message: "Email already registered" },
      }),
    });

    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Mock Google Login" }));

    await waitFor(() =>
      expect(screen.getByText("Email already registered")).toBeInTheDocument(),
    );
  });

  it("submits the Google credential as the request payload", async () => {
    const fetchMock = mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "ok",
        data: {
          id: "1",
          fullName: "Jane Doe",
          email: "jane@example.com",
          googleId: "google-sub-123",
        },
      }),
    });

    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Mock Google Login" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(options.body as string)).toEqual({
      credential: "fake-google-credential",
    });
  });

  it("does not call the SSO endpoint when Google returns no credential", async () => {
    const fetchMock = mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, message: "ok", data: {} }),
    });

    renderForm();
    fireEvent.click(
      screen.getByRole("button", { name: "Mock Google Login (no credential)" }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
