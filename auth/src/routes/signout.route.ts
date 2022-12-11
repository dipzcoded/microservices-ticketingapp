import express, { Router } from "express";

// Controllers
import { signOut } from "../controllers";

// middlewares
import { checkAuth, jwtPayloadExtract } from "@realmtickets/common";

const router: Router = express.Router();

router.post("/api/users/signout", jwtPayloadExtract, checkAuth, signOut);

export default router;
