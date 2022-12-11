import { Request, Response } from "express";
import { SignInDto } from "../dtos";
import { InvalidRequestError } from "@realmtickets/common";
import { User } from "../models";
import jwt from "jsonwebtoken";
import { StatusCodeEnum } from "@realmtickets/common";
import { Password } from "../utils";
import { JwtPayloadType } from "@realmtickets/common";
export const signIn = async (req: Request, res: Response) => {
  const { uniqueId, password }: SignInDto = req.body;
  const existingUser = await User.findOne({
    $or: [{ email: uniqueId }, { username: uniqueId }],
  });

  if (!existingUser) {
    throw new InvalidRequestError("Invalid credentails");
  }

  const isMatch = await Password.compare(existingUser.password, password);
  if (!isMatch) {
    throw new InvalidRequestError("Invalid credentials");
  }

  // generate a jwt token
  const payload: JwtPayloadType = {
    user: {
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
    },
  };

  const userJwtToken = jwt.sign(payload, process.env.JWT_SECRET!);

  // store in a session object
  req.session = {
    jwt: userJwtToken,
  };

  return res.status(StatusCodeEnum.OK).json(existingUser);
};
