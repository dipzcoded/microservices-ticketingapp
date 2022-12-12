import {
  ForbiddenRequestError,
  NotFoundError,
  StatusCodeEnum,
} from "@realmtickets/common";
import { Request, Response } from "express";
import { Orders } from "../models";
export const showOrderById = async (req: Request, res: Response) => {
  const { id: orderId } = req.params;
  const order = await Orders.findById(orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (order.userId !== req.user!.user.id) {
    throw new ForbiddenRequestError(
      "Order was not created by current logged in user"
    );
  }

  res.status(StatusCodeEnum.OK).json({ order });
};
