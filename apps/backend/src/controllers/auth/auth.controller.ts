import type { Request, Response } from "express";
import { authService } from "../../services/auth/auth.service.ts";

export const authController = {
  register: async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;
    const { id } = await authService.register(fullName, email, password);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil, silahkan lakukan login",
      data: {
        id: id,
        fullName: fullName,
        email: email,
      },
    });
  },

  registerSso: async (req: Request, res: Response) => {
    const { credential } = req.body;
    const { id, fullName, email, googleId, token } =
      await authService.registerSso(credential);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        id: id,
        fullName: fullName,
        email: email,
        googleId: googleId,
      },
    });
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await authService.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
    });
  },

  loginSso: async (req: Request, res: Response) => {
    const { credential } = req.body;
    const token = await authService.loginSso(credential);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login berhasil",
    });
  },

  logout: async (req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout berhasil",
    });
  },
};
