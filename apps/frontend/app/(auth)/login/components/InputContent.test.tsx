import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Providers from "@/app/providers";
import InputContent from "./InputContent";

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
      <InputContent />
    </Providers>,
  );
}

function fillForm({
  email = "jane@example.com",
  password = "secret123",
}: Partial<Record<"email" | "password", string>> = {}) {
  fireEvent.change(screen.getByLabelText("Email Address"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: password },
  });
}

describe("InputContent (login)", () => {
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
    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled(),
    );

    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "Login berhasil",
      }),
    });

    await waitFor(() =>
      expect(screen.getByText("Berhasil Login")).toBeInTheDocument(),
    );
    expect(screen.getByRole("button", { name: /^login$/i })).not.toBeDisabled();
  });

  it("shows the server error message when login fails", async () => {
    mockFetchOnce({
      ok: false,
      status: 404,
      json: async () => ({
        success: false,
        error: { code: "NotFoundError", message: "Account not found" },
      }),
    });

    renderForm();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() =>
      expect(screen.getByText("Account not found")).toBeInTheDocument(),
    );
  });

  it("submits exactly email and password", async () => {
    const fetchMock = mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "Login berhasil",
      }),
    });

    renderForm();
    fillForm({ email: "jane@example.com", password: "secret123" });
    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(options.body as string)).toEqual({
      email: "jane@example.com",
      password: "secret123",
    });
  });
});

describe("InputContent (login) — Google SSO", () => {
  it("shows a pending state then a success message on successful SSO login", async () => {
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
      expect(screen.getByText("Signing in...")).toBeInTheDocument(),
    );

    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "Berhasil Login",
      }),
    });

    await waitFor(() =>
      expect(screen.getByText("Berhasil Login")).toBeInTheDocument(),
    );
    expect(screen.queryByText("Signing in...")).not.toBeInTheDocument();
  });

  it("shows the server error message when SSO login fails", async () => {
    mockFetchOnce({
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        error: { code: "UnauthorizedError", message: "Invalid Google token" },
      }),
    });

    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Mock Google Login" }));

    await waitFor(() =>
      expect(screen.getByText("Invalid Google token")).toBeInTheDocument(),
    );
  });

  it("submits the Google credential as the request payload", async () => {
    const fetchMock = mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "Berhasil Login",
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
      json: async () => ({ success: true, message: "Berhasil Login" }),
    });

    renderForm();
    fireEvent.click(
      screen.getByRole("button", { name: "Mock Google Login (no credential)" }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
