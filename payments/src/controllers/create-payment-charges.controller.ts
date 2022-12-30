import {
  ForbiddenRequestError,
  InvalidRequestError,
  NotFoundError,
  OrderStatusEnum,
  StatusCodeEnum,
} from "@realmtickets/common";
import { Request, Response } from "express";
import { CreatePaymentChargeDto } from "../dtos";
import { stripe } from "../stripe-wrapper.utils";
import { Orders } from "../models";

export const createPaymentCharges = async (req: Request, res: Response) => {
  const { token, orderId }: CreatePaymentChargeDto = req.body;
  const order = await Orders.findById(orderId);
  if (!order) {
    throw new NotFoundError("order is not found!");
  }

  if (order.userId !== req.user!.user.id) {
    throw new ForbiddenRequestError(
      "Order cannot be paid by you cause it isnt yours"
    );
  }

  if (order.status === OrderStatusEnum.Cancelled) {
    throw new InvalidRequestError(
      "order can be purchased cause it's been cancelled"
    );
  }

  await stripe.charges.create({
    currency: "usd",
    amount: order.price * 100,
    source: token,
  });

  res.status(StatusCodeEnum.CREATED).json({ success: true });
};
