import expres, { Router } from "express";
import {
  jwtPayloadExtract,
  checkAuth,
  validationRequestMiddleware,
} from "@realmtickets/common";
import { createOrderValidation } from "../middleware/validator";
import { createOrder } from "../controllers";

const router: Router = expres.Router();
router.use(jwtPayloadExtract);
router.use(checkAuth);
router.use(createOrderValidation);
router.use(validationRequestMiddleware);

router.route("/api/orders").post(createOrder);

export default router;
