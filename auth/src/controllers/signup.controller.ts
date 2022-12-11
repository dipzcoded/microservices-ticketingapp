import { Request, Response } from "express";

import jwt from "jsonwebtoken";
import { ForbiddenRequestError } from "@realmtickets/common";
import { User } from "../models";
import { SignUpDto } from "../dtos";
import { StatusCodeEnum } from "@realmtickets/common";
import { JwtPayloadType } from "@realmtickets/common";

export const signUp = async (req: Request, res: Response) => {
  const { email, password, username }: SignUpDto = req.body;

  const userFound = await User.findOne({ $or: [{ email }, { username }] });

  if (userFound) {
    throw new ForbiddenRequestError("User already exist");
  }

  const newUser = User.build({ email, password, username });
  await newUser.save();

  // generate jwt token
  const payload: JwtPayloadType = {
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    },
  };

  const userJwtToken = jwt.sign(payload, process.env.JWT_SECRET!);

  // store it on session object
  req.session = {
    jwt: userJwtToken,
  };

  return res.status(StatusCodeEnum.CREATED).json(newUser);
};
