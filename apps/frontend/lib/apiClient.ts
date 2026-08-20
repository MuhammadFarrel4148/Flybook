const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3200/api";

interface ApiErrorBody {
  success: false;
  error: { code: string; message: string };
}

export interface ApiSuccessBody<T> {
  success: true;
  message: string;
  data: T;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const body = await res.json();

  if (!res.ok || body.success === false) {
    const { code, message } = (body as ApiErrorBody).error ?? {
      code: "UNKNOWN_ERROR",
      message: "Terjadi kesalahan yang tidak diketahui",
    };
    throw new ApiError(res.status, code, message);
  }

  return body as T;
}
