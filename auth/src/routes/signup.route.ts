import express, { Router } from "express";

// Controllers
import { signUp } from "../controllers";

import { signUpValidation } from "../middleware/validator";

// validations
import { validationRequestMiddleware } from "@realmtickets/common";

const router: Router = express.Router();

router.post(
  "/api/users/signup",
  signUpValidation,
  validationRequestMiddleware,
  signUp
);

export default router;
