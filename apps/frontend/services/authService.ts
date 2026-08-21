import { apiFetch, type ApiSuccessBody } from "@/lib/apiClient";
import type {
  RegisterPayload,
  RegisterResponseData,
  RegisterSsoPayload,
  RegisterSsoResponseData,
  LoginPayload,
  LoginResponseData,
} from "@/types/auth";

async function registerUser(
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

async function registerUserSso(
  payload: RegisterSsoPayload,
): Promise<RegisterSsoResponseData> {
  const response = await apiFetch<ApiSuccessBody<RegisterSsoResponseData>>(
    "/auth/register/sso",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

async function loginUser(payload: LoginPayload): Promise<LoginResponseData> {
  const response = await apiFetch<ApiSuccessBody<LoginResponseData>>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return response;
}

export { registerUser, registerUserSso, loginUser };
