import express, { Router } from "express";

import { validationRequestMiddleware } from "@realmtickets/common";

import { signInValidation } from "../middleware/validator";
// Controllers
import { signIn } from "../controllers";

const router: Router = express.Router();

router.post(
  "/api/users/signin",
  signInValidation,
  validationRequestMiddleware,
  signIn
);

export default router;
