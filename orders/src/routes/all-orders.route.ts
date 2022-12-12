import expres, { Router } from "express";
import { jwtPayloadExtract, checkAuth } from "@realmtickets/common";

import { allOrders } from "../controllers";

const router: Router = expres.Router();

router.route("/api/orders").get(jwtPayloadExtract, checkAuth, allOrders);

export default router;
