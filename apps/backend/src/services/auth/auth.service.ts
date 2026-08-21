import "dotenv/config";
import { ConflictError } from "../../../exceptions/ConflictError.ts";
import { NotFoundError } from "../../../exceptions/NotFoundError.ts";
import { BadRequestError } from "../../../exceptions/BadRequestError.ts";
import { authRepository } from "../../repositories/auth/auth.repository.ts";
import { generateToken } from "../../../lib/generateToken.ts";
import { OAuth2Client } from "google-auth-library";

const CLIENT = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authService = {
  register: async (fullName: string, email: string, password: string) => {
    const isRegister = await authRepository.findUserByEmail(email);

    if (isRegister) {
      throw new ConflictError("Email already registered");
    }

    const { id } = await authRepository.registerAccount({
      fullName,
      email,
      password,
    });
    return { id };
  },

  registerSso: async (credential: string) => {
    if (!credential) {
      throw new BadRequestError("Token tidak ditemukan");
    }

    const ticket = await CLIENT.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email_verified) {
      throw new BadRequestError("Email belum terverifikasi");
    }

    const { name: fullName, email, sub: googleId } = payload;

    const isRegistered = await authRepository.findUserByEmail(email!);

    if (isRegistered) {
      throw new ConflictError("Email already registered");
    }

    const { id } = await authRepository.registerAccount({
      fullName: fullName!,
      email: email!,
      googleId: googleId,
    });

    const token = generateToken(id, email!);

    return { id, fullName, email, googleId, token };
  },

  login: async (email: string, password: string) => {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundError("Account not found");
    }

    if (user.password !== password) {
      throw new BadRequestError("Email or password wrong");
    }

    const token = generateToken(user.id, user.email);

    return token;
  },

  loginSso: async (credential: string) => {
    if (!credential) {
      throw new BadRequestError("Token tidak ditemukan");
    }

    let ticket;
    try {
      ticket = await CLIENT.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch {
      throw new BadRequestError("Token Google tidak valid");
    }

    const payload = ticket.getPayload();

    if (!payload?.email_verified) {
      throw new BadRequestError("Email belum terverifikasi");
    }

    const { email } = payload;

    const user = await authRepository.findUserByEmail(email!);

    if (!user) {
      throw new NotFoundError("Akun tidak ditemukan");
    }

    if (!user.googleId) {
      throw new BadRequestError("Akun ini tidak terdaftar melalui Google SSO");
    }

    const token = generateToken(user.id, email!);

    return token;
  },
};
