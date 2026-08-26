import { prisma } from "../../../lib/prisma.ts";
import { CabinClass, SeatStatus } from "../../../generated/prisma/client.ts";

export const ticketRepository = {
  findTicket: async (
    from: string,
    to: string,
    date: string,
    passanger: number,
    classTicket: string,
  ) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const flights = await prisma.flight.findMany({
      where: {
        originAirport: from,
        destinationAirport: to,
        departureTime: {
          gte: startDate,
          lte: endDate,
        },
        seats: {
          some: {
            seatClass: classTicket as CabinClass,
            status: SeatStatus.AVAILABLE,
          },
        },
      },
      include: {
        seats: {
          where: {
            seatClass: classTicket as CabinClass,
            status: SeatStatus.AVAILABLE,
          },
        },
      },
    });

    return flights.filter((flight) => flight.seats.length >= passanger);
  },
};
