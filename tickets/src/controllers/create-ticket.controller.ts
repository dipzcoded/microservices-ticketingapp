import { Request, Response } from "express";
import { Tickets } from "../models";
import { CreateTicketsDto } from "../dtos";
import { StatusCodeEnum } from "@realmtickets/common";
import { TicketCreatedPublisher } from "../events";
import { natsClient } from "../nats-wrapper.utils";
export const createTicket = async (req: Request, res: Response) => {
  const { price, title }: CreateTicketsDto = req.body;

  const newUserTicket = Tickets.build({
    price,
    title,
    userId: req.user!.user.id,
  });

  await newUserTicket.save();

  await new TicketCreatedPublisher(natsClient.client).publish({
    id: newUserTicket.id,
    title: newUserTicket.title,
    price: newUserTicket.price,
    userId: newUserTicket.userId,
  });
  res.status(StatusCodeEnum.CREATED).json({ ticket: newUserTicket });
};
