import {
  ForbiddenRequestError,
  NotFoundError,
  OrderStatusEnum,
  StatusCodeEnum,
} from "@realmtickets/common";
import { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events";
import { Orders } from "../models";
import { natsClient } from "../nats-wrapper.utils";
export const deleteOrderById = async (req: Request, res: Response) => {
  const { id: orderId } = req.params;

  const order = await Orders.findById(orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError("Ticket not found");
  }

  if (order.userId !== req.user!.user.id) {
    throw new ForbiddenRequestError(
      "Order was not created by current logged in user"
    );
  }

  order.status = OrderStatusEnum.Cancelled;
  await order.save();

  // publish an order cancelled event

  new OrderCancelledPublisher(natsClient.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(StatusCodeEnum.DELETED).json({ order });
};
