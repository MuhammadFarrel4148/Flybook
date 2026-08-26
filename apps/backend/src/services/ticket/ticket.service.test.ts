import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../repositories/ticket/ticket.repository.ts", () => ({
  ticketRepository: {
    findTicket: vi.fn(),
  },
}));

import { ticketRepository } from "../../repositories/ticket/ticket.repository.ts";
import { ticketService } from "./ticket.service.ts";

describe("ticketService.searchTicket", () => {
  beforeEach(() => {
    vi.mocked(ticketRepository.findTicket).mockReset();
  });

  it("calls ticketRepository.findTicket with the given args and wraps the result in data", async () => {
    const flights = [{ id: "flight-1" }];
    vi.mocked(ticketRepository.findTicket).mockResolvedValue(flights as never);

    const result = await ticketService.searchTicket(
      "CGK",
      "DPS",
      "2026-09-01",
      2,
      "ECONOMY",
    );

    expect(ticketRepository.findTicket).toHaveBeenCalledWith(
      "CGK",
      "DPS",
      "2026-09-01",
      2,
      "ECONOMY",
    );
    expect(result).toEqual({ data: flights });
  });

  it("returns an empty data array when no flights match", async () => {
    vi.mocked(ticketRepository.findTicket).mockResolvedValue([] as never);

    const result = await ticketService.searchTicket(
      "CGK",
      "DPS",
      "2026-09-01",
      2,
      "ECONOMY",
    );

    expect(result).toEqual({ data: [] });
  });
});
