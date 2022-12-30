import { body } from "express-validator";
import mongoose from "mongoose";

export default [
  body("token")
    .not()
    .isEmpty()
    .withMessage("Token must be provided to charge user acct"),
  body("orderId")
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("OrderId must be provided"),
];
