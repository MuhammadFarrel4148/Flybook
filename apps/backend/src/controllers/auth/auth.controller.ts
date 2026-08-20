import type { Request, Response } from "express";
import { authService } from "../../services/auth/auth.service.ts";

export const authController = {
  register: async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;
    const { id } = await authService.register(fullName, email, password);

    res.status(200).json({
      success: true,
      message: "Registrasi berhasil, silahkan lakukan login",
      data: {
        id: id,
        fullName: fullName,
        email: email,
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
};
