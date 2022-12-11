import {
  ForbiddenRequestError,
  NotFoundError,
  StatusCodeEnum,
} from "@realmtickets/common";
import { Request, Response } from "express";
import { UpdateTicketByIdDtos } from "../dtos";
import { Tickets } from "../models";
import { TicketUpdatedPublisher } from "../events";
import { natsClient } from "../nats-wrapper.utils";
export const updateTicketById = async (req: Request, res: Response) => {
  const { id: ticketId } = req.params;
  const { title, price }: UpdateTicketByIdDtos = req.body;
  const ticket = await Tickets.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError("ticket not found");
  }

  if (ticket.userId !== req.user!.user.id) {
    throw new ForbiddenRequestError(
      "cant have access to ticket you didnt create"
    );
  }

  ticket.title = title;
  ticket.price = price;

  const updatedTicket = await ticket.save();

  await new TicketUpdatedPublisher(natsClient.client).publish({
    id: ticket.id,
    title: updatedTicket.title,
    price: updatedTicket.price,
    userId: updatedTicket.userId,
  });

  return res.status(StatusCodeEnum.OK).json({ ticket });
};
