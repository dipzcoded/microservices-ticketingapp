import { body } from "express-validator";

export default [
  body("uniqueId").notEmpty().withMessage("email or username must be passed"),
  body("password").trim().notEmpty().withMessage("password must be sent"),
];
