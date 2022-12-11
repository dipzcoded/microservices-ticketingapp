import expres, { Router } from "express";
import { jwtPayloadExtract, checkAuth } from "@realmtickets/common";

import { allOrders } from "../controllers";

const router: Router = expres.Router();

router.use(jwtPayloadExtract);
router.use(checkAuth);
router.route("/api/orders").get(allOrders);

export default router;
