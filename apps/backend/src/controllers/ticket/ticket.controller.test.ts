import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

vi.mock("../../services/ticket/ticket.service.ts", () => ({
  ticketService: {
    searchTicket: vi.fn(),
  },
}));

import { ticketService } from "../../services/ticket/ticket.service.ts";
import { ticketController } from "./ticket.controller.ts";

function createMockResponse() {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  const res = { status } as unknown as Response;
  return { res, status, json };
}

const payload = {
  from: "CGK",
  to: "DPS",
  date: "2026-09-01",
  passanger: 2,
  classTicket: "ECONOMY",
};

describe("ticketController.searchTicket", () => {
  beforeEach(() => {
    vi.mocked(ticketService.searchTicket).mockReset();
  });

  it("calls ticketService.searchTicket with the request body and responds 200 with the data", async () => {
    const flights = [{ id: "flight-1" }];
    vi.mocked(ticketService.searchTicket).mockResolvedValue({
      data: flights,
    } as never);
    const req = { body: payload } as unknown as Request;
    const { res, status, json } = createMockResponse();

    await ticketController.searchTicket(req, res);

    expect(ticketService.searchTicket).toHaveBeenCalledWith(
      payload.from,
      payload.to,
      payload.date,
      payload.passanger,
      payload.classTicket,
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      success: true,
      data: flights,
    });
  });

  it("propagates the error from ticketService and never responds when the search fails", async () => {
    const error = new Error("something went wrong");
    vi.mocked(ticketService.searchTicket).mockRejectedValue(error);
    const req = { body: payload } as unknown as Request;
    const { res, status, json } = createMockResponse();

    await expect(
      ticketController.searchTicket(req, res),
    ).rejects.toBeInstanceOf(Error);
    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
  });
});
