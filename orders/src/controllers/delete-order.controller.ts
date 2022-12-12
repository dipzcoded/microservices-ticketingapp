import {
  ForbiddenRequestError,
  NotFoundError,
  OrderStatusEnum,
  StatusCodeEnum,
} from "@realmtickets/common";
import { Request, Response } from "express";
import { Orders } from "../models";
export const deleteOrderById = async (req: Request, res: Response) => {
  const { id: orderId } = req.params;

  const order = await Orders.findById(orderId);
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

  res.status(StatusCodeEnum.DELETED).json({ order });
};
