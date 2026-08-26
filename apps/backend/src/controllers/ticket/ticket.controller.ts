import type { Request, Response } from "express";
import { ticketService } from "../../services/ticket/ticket.service.ts";

export const ticketController = {
  searchTicket: async (req: Request, res: Response) => {
    const { from, to, date, passanger, classTicket } = req.body;
    const { data } = await ticketService.searchTicket(
      from,
      to,
      date,
      passanger,
      classTicket,
    );

    res.status(200).json({
      success: true,
      data: data,
    });
  },
};
