import express, { Router } from "express";
import {
  jwtPayloadExtract,
  checkAuth,
  validationRequestMiddleware,
} from "@realmtickets/common";
import { paymentChargesValidation } from "../middlewares/validators";
import { createPaymentCharges } from "../controllers";
const router: Router = express.Router();

router
  .route("/api/payments")
  .post(
    jwtPayloadExtract,
    checkAuth,
    paymentChargesValidation,
    validationRequestMiddleware,
    createPaymentCharges
  );

export default router;
