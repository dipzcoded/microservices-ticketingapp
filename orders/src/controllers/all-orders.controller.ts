import { Request, Response } from "express";
import { Orders } from "../models";
export const allOrders = async (req: Request, res: Response) => {
  const userOrders = await Orders.find({
    userId: req.user!.user.id,
  }).populate("ticket");
  res.json({ orders: userOrders });
};
