import express, { Router } from "express";

// Controllers
import { getCurrentUser } from "../controllers";

// middleware
import { jwtPayloadExtract, checkAuth } from "@realmtickets/common/";

const router: Router = express.Router();

router.get(
  "/api/users/currentuser",
  jwtPayloadExtract,
  checkAuth,
  getCurrentUser
);

export default router;
