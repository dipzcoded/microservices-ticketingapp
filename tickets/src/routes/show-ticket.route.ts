import express, { Router } from "express";
import { showTicketById } from "../controllers";

const router: Router = express.Router();

router.route("/api/tickets/:id").get(showTicketById);
export default router;
