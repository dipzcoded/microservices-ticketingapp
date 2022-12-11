import { NotFoundError, StatusCodeEnum } from "@realmtickets/common";
import { Request, Response } from "express";
import { Tickets } from "../models";
export const showTicketById = async (req: Request, res: Response) => {
  const { id: ticketId } = req.params;
  const ticket = await Tickets.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError("ticket not found");
  }
  return res.status(StatusCodeEnum.OK).json({ ticket });
};
