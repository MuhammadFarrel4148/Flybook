export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponseData {
  id: string;
  fullName: string;
  email: string;
}

export interface RegisterSsoPayload {
  credential: string;
}

export interface RegisterSsoResponseData {
  id: string;
  fullName: string;
  email: string;
  googleId: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  success: boolean;
  message: string;
}

export interface LoginSsoPayload {
  credential: string;
}

export interface LoginSsoResponseData {
  success: boolean;
  message: string;
}

export interface LogoutResponseData {
  success: boolean;
  message: string;
}
