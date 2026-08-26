import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../lib/prisma.ts", () => ({
  prisma: {
    flight: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "../../../lib/prisma.ts";
import { ticketRepository } from "./ticket.repository.ts";

const prismaMock = prisma as unknown as {
  flight: {
    findMany: ReturnType<typeof vi.fn>;
  };
};

describe("ticketRepository.findTicket", () => {
  beforeEach(() => {
    prismaMock.flight.findMany.mockReset();
  });

  it("queries prisma.flight.findMany with route, day range, and seat class/availability filters", async () => {
    prismaMock.flight.findMany.mockResolvedValue([]);

    const date = "2026-09-01";
    const expectedStart = new Date(date);
    expectedStart.setHours(0, 0, 0, 0);
    const expectedEnd = new Date(date);
    expectedEnd.setHours(23, 59, 59, 999);

    await ticketRepository.findTicket("CGK", "DPS", date, 2, "ECONOMY");

    expect(prismaMock.flight.findMany).toHaveBeenCalledWith({
      where: {
        originAirport: "CGK",
        destinationAirport: "DPS",
        departureTime: {
          gte: expectedStart,
          lte: expectedEnd,
        },
        seats: {
          some: {
            seatClass: "ECONOMY",
            status: "AVAILABLE",
          },
        },
      },
      include: {
        seats: {
          where: {
            seatClass: "ECONOMY",
            status: "AVAILABLE",
          },
        },
      },
    });
  });

  it("returns flights whose matching available seats meet the passenger count", async () => {
    const flights = [
      { id: "flight-1", seats: [{ id: "seat-1" }, { id: "seat-2" }] },
    ];
    prismaMock.flight.findMany.mockResolvedValue(flights);

    const result = await ticketRepository.findTicket(
      "CGK",
      "DPS",
      "2026-09-01",
      2,
      "ECONOMY",
    );

    expect(result).toEqual(flights);
  });

  it("filters out flights whose matching available seats are fewer than the passenger count", async () => {
    const flights = [
      { id: "flight-1", seats: [{ id: "seat-1" }] },
      { id: "flight-2", seats: [{ id: "seat-2" }, { id: "seat-3" }] },
    ];
    prismaMock.flight.findMany.mockResolvedValue(flights);

    const result = await ticketRepository.findTicket(
      "CGK",
      "DPS",
      "2026-09-01",
      2,
      "ECONOMY",
    );

    expect(result).toEqual([flights[1]]);
  });
});
