import { body } from "express-validator";

export default [
  body("username")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("username cant be empty"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("password must be between 4 and 20 characters long"),
];
