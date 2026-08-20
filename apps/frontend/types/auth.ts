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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  success: boolean;
  message: string;
}
