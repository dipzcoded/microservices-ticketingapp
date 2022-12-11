import { StatusCodeEnum } from "@realmtickets/common";
import { Response, Request } from "express";
import { Tickets } from "../models";
export const allTickets = async (req: Request, res: Response) => {
  const allTickets = await Tickets.find({});
  return res.status(StatusCodeEnum.OK).json({ tickets: allTickets });
};
