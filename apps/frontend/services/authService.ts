import { apiFetch, type ApiSuccessBody } from "@/lib/apiClient";
import type { RegisterPayload, RegisterResponseData } from "@/types/auth";

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponseData> {
  const response = await apiFetch<ApiSuccessBody<RegisterResponseData>>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}
