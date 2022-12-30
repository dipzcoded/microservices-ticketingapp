import {
  OrderCancelledEventInterface,
  OrderStatusEnum,
} from "@realmtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Orders } from "../../../models";
import { natsClient } from "../../../nats-wrapper.utils";
import { OrderCancelledListener } from "../order-cancelled.listener";

const setUp = async () => {
  const listener = new OrderCancelledListener(natsClient.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Orders.build({
    id: orderId,
    price: 300,
    status: OrderStatusEnum.Created,
    userId: "kdbsj",
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEventInterface["data"] = {
    id: orderId,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
    version: 1,
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    order,
    data,
    msg,
  };
};

it("update the order status to cancelled", async () => {
  const { listener, data, msg } = await setUp();
  await listener.onMessage(data, msg);
  const order = await Orders.findById(data.id);
  expect(order).toBeDefined();
  expect(order!.status).toEqual(OrderStatusEnum.Cancelled);
  expect(order!.version).toEqual(1);
});
it("acks the message", async () => {
  const { listener, data, msg } = await setUp();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
