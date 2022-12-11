import express, { Router } from "express";
import {
  jwtPayloadExtract,
  checkAuth,
  validationRequestMiddleware,
} from "@realmtickets/common";

import { createTicket } from "../controllers";
import { createTicketValidation } from "../middleware/validator";

const router: Router = express.Router();

router
  .route("/api/tickets")
  .post(
    jwtPayloadExtract,
    checkAuth,
    createTicketValidation,
    validationRequestMiddleware,
    createTicket
  );
export default router;
