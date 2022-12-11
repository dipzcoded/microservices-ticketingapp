import express, { Router } from "express";
import {
  checkAuth,
  jwtPayloadExtract,
  validationRequestMiddleware,
} from "@realmtickets/common";
import { updateTicketByIdValidation } from "../middleware/validator";
import { updateTicketById } from "../controllers";

const router: Router = express.Router();

router
  .route("/api/tickets/:id")
  .put(
    jwtPayloadExtract,
    checkAuth,
    updateTicketByIdValidation,
    validationRequestMiddleware,
    updateTicketById
  );

export default router;
