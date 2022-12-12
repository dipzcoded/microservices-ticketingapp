import expres, { Router } from "express";

import { jwtPayloadExtract, checkAuth } from "@realmtickets/common";

import { deleteOrderById } from "../controllers";

const router: Router = expres.Router();

router
  .route("/api/orders/:id")
  .delete(jwtPayloadExtract, checkAuth, deleteOrderById);

export default router;
