import {
  ForbiddenRequestError,
  NotFoundError,
  OrderStatusEnum,
  StatusCodeEnum,
} from "@realmtickets/common";
import { Request, Response } from "express";
import { Orders, Tickets } from "../models";
import { natsClient } from "../nats-wrapper.utils";
import { OrderCreatedPublisher } from "../events";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;
export const createOrder = async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  // find the ticket the user try to order in the database
  const ticket = await Tickets.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError("Ticket not found");
  }

  // Make sure that the ticket is not already reserved
  const isReserved = await ticket.isReserved();

  if (isReserved) {
    throw new ForbiddenRequestError("Ticket is already reserved");
  }
  // calcuate an expiration date for the order

  const expiration = new Date();
  //   15 minutes
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  // Build the order save it to the database
  const order = await Orders.build({
    userId: req.user!.user.id,
    status: OrderStatusEnum.Created,
    expiresAt: expiration,
    ticket,
  });

  await order.save();
  //   Publish an order created event

  new OrderCreatedPublisher(natsClient.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  });

  res.status(StatusCodeEnum.CREATED).json({ order });
};
