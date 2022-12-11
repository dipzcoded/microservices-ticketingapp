import express, { Router } from "express";
import { checkAuth, jwtPayloadExtract } from "@realmtickets/common";
import { allTickets } from "../controllers";

const router: Router = express.Router();
router.route("/api/tickets").get(allTickets);
export default router;
