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
};
