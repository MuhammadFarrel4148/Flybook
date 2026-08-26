import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.ts";
import { prisma } from "../../lib/prisma.ts";
import { CabinClass, SeatStatus } from "../../generated/prisma/client.ts";

async function seedFlight(
  overrides: Partial<{
    originAirport: string;
    destinationAirport: string;
    departureTime: Date;
  }> = {},
) {
  return prisma.flight.create({
    data: {
      airlineName: "Garuda Indonesia",
      flightNumber: "GA400",
      originAirport: "CGK",
      destinationAirport: "DPS",
      departureTime: new Date("2026-09-01T07:00:00.000Z"),
      arrivalTime: new Date("2026-09-01T09:30:00.000Z"),
      ...overrides,
    },
  });
}

describe("POST /api/ticket/search-ticket", () => {
  it("returns flights whose available economy seats meet the passenger count", async () => {
    const flight = await seedFlight();
    await prisma.seat.createMany({
      data: [
        {
          flightId: flight.id,
          seatNumber: "1A",
          seatClass: CabinClass.ECONOMY,
          status: SeatStatus.AVAILABLE,
          price: 850000,
        },
        {
          flightId: flight.id,
          seatNumber: "1B",
          seatClass: CabinClass.ECONOMY,
          status: SeatStatus.AVAILABLE,
          price: 850000,
        },
        {
          flightId: flight.id,
          seatNumber: "1C",
          seatClass: CabinClass.ECONOMY,
          status: SeatStatus.OCCUPIED,
          price: 850000,
        },
        {
          flightId: flight.id,
          seatNumber: "2A",
          seatClass: CabinClass.BUSINESS,
          status: SeatStatus.AVAILABLE,
          price: 2500000,
        },
      ],
    });

    const res = await request(app).post("/api/ticket/search-ticket").send({
      from: "CGK",
      to: "DPS",
      date: "2026-09-01",
      passanger: 2,
      classTicket: "ECONOMY",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(flight.id);
    expect(res.body.data[0].seats).toHaveLength(2);
  });

  it("returns an empty list when no flight has enough available seats in the requested class", async () => {
    const flight = await seedFlight();
    await prisma.seat.create({
      data: {
        flightId: flight.id,
        seatNumber: "1A",
        seatClass: CabinClass.ECONOMY,
        status: SeatStatus.AVAILABLE,
        price: 850000,
      },
    });

    const res = await request(app).post("/api/ticket/search-ticket").send({
      from: "CGK",
      to: "DPS",
      date: "2026-09-01",
      passanger: 2,
      classTicket: "ECONOMY",
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it("returns an empty list when no flight matches the requested route/date", async () => {
    await seedFlight();

    const res = await request(app).post("/api/ticket/search-ticket").send({
      from: "CGK",
      to: "SUB",
      date: "2026-09-01",
      passanger: 1,
      classTicket: "ECONOMY",
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});
