import { body } from "express-validator";
export default [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("price must be greater than 0"),
];
