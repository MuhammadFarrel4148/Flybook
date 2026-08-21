import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Providers from "@/app/providers";
import Layout from "./layout";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/flight",
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@react-oauth/google", () => ({
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) =>
    children,
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
  pushMock.mockReset();
});

function renderLayout() {
  return render(
    <Providers>
      <Layout>
        <div>Child content</div>
      </Layout>
    </Providers>,
  );
}

function openProfileMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Flybook" }));
}

describe("Dashboard Layout — logout", () => {
  it("shows a pending state then redirects to /login on successful logout", async () => {
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

    renderLayout();
    openProfileMenu();
    fireEvent.click(screen.getByRole("button", { name: /^logout$/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /logging out/i }),
      ).toBeDisabled(),
    );

    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "Logout berhasil",
      }),
    });

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));
    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the server error message when logout fails", async () => {
    mockFetchOnce({
      ok: false,
      status: 500,
      json: async () => ({
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Gagal logout" },
      }),
    });

    renderLayout();
    openProfileMenu();
    fireEvent.click(screen.getByRole("button", { name: /^logout$/i }));

    await waitFor(() =>
      expect(screen.getByText("Gagal logout")).toBeInTheDocument(),
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("sends a POST request to /auth/logout", async () => {
    const fetchMock = mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "Logout berhasil",
      }),
    });

    renderLayout();
    openProfileMenu();
    fireEvent.click(screen.getByRole("button", { name: /^logout$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/auth/logout");
    expect(options.method).toBe("POST");
  });
});
