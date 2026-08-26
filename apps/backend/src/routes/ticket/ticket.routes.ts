import { Router } from "express";
import { ticketController } from "../../controllers/ticket/ticket.controller.ts";

const router = Router();

router.post("/search-ticket", ticketController.searchTicket);

export default router;
