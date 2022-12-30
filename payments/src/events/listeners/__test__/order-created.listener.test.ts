import {
  OrderCreatedEventInterface,
  OrderStatusEnum,
} from "@realmtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Orders } from "../../../models";
import { natsClient } from "../../../nats-wrapper.utils";
import { OrderCreatedListener } from "../order-created.listener";

const setUp = async () => {
  const listener = new OrderCreatedListener(natsClient.client);

  const data: OrderCreatedEventInterface["data"] = {
    expiresAt: "akjdhd",
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatusEnum.Created,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 300,
    },
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  //   @ts-ignore
  const messsage: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    messsage,
  };
};

it("create a new order", async () => {
  const { data, listener, messsage } = await setUp();
  await listener.onMessage(data, messsage);
  const updatedOrder = await Orders.findById(data.id);
  expect(updatedOrder).toBeDefined();
  expect(updatedOrder!.version).toEqual(data.version);
  expect(updatedOrder!.status).toEqual(OrderStatusEnum.Created);
});

it("acks the message", async () => {
  const { data, listener, messsage } = await setUp();
  await listener.onMessage(data, messsage);
  expect(messsage.ack).toHaveBeenCalled();
});
