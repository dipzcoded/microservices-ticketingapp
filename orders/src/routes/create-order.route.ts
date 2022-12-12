import expres, { Router } from "express";
import {
  jwtPayloadExtract,
  checkAuth,
  validationRequestMiddleware,
} from "@realmtickets/common";
import { createOrderValidation } from "../middleware/validator";
import { createOrder } from "../controllers";

const router: Router = expres.Router();

router
  .route("/api/orders")
  .post(
    jwtPayloadExtract,
    checkAuth,
    createOrderValidation,
    validationRequestMiddleware,
    createOrder
  );

export default router;
