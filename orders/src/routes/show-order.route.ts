import expres, { Router } from "express";

import { jwtPayloadExtract, checkAuth } from "@realmtickets/common";

import { showOrderById } from "../controllers";

const router: Router = expres.Router();

router.route("/api/orders/:id").get(showOrderById);

export default router;
