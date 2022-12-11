import mongoose from "mongoose";
import { body } from "express-validator";
export default [
  body("ticketId")
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("TicketId must be provided"),
];
