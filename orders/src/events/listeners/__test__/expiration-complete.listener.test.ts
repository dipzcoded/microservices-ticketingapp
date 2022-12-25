import { natsClient } from "../../../nats-wrapper.utils";
import { ExpirationCompleteListener } from "../expiration-complete.listener";
import { Message } from "node-nats-streaming";
import { Orders, Tickets } from "../../../models";
import mongoose from "mongoose";
import {
  ExpirationCompleteEventInterface,
  OrderCancelledEventInterface,
  OrderStatusEnum,
} from "@realmtickets/common";

const setUp = async () => {
  const listener = new ExpirationCompleteListener(natsClient.client);

  const ticket = Tickets.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "Ye concert",
  });

  await ticket.save();

  const order = Orders.build({
    expiresAt: new Date(),
    status: OrderStatusEnum.Created,
    ticket,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await order.save();

  const data: ExpirationCompleteEventInterface["data"] = {
    orderId: order.id,
  };

  //   @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, message };
};

it("updates the order status to cancelled", async () => {
  const { data, listener, message, order } = await setUp();

  await listener.onMessage(data, message);
  const updatedOrder = await Orders.findById(order.id);
  expect(updatedOrder!.version).toEqual(1);
  expect(updatedOrder!.status).toEqual(OrderStatusEnum.Cancelled);
});

it("emit an OrderCancelled Event", async () => {
  const { data, listener, message, order } = await setUp();

  await listener.onMessage(data, message);
  expect(natsClient.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsClient.client.publish as jest.Mock).mock.calls[0][1]
  ) as OrderCancelledEventInterface["data"];
  expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
  const { data, listener, message } = await setUp();

  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
