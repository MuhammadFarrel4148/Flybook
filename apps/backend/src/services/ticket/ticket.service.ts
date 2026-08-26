import { ticketRepository } from "../../repositories/ticket/ticket.repository.ts";

export const ticketService = {
  searchTicket: async (
    from: string,
    to: string,
    date: string,
    passanger: number,
    classTicket: string,
  ) => {
    const data = await ticketRepository.findTicket(
      from,
      to,
      date,
      passanger,
      classTicket,
    );

    return { data };
  },
};
