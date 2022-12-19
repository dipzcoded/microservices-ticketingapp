import {
  OrderCreatedEventInterface,
  OrderStatusEnum,
} from "@realmtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Tickets } from "../../../models";
import { natsClient } from "../../../nats-wrapper.utils";
import { OrderCreatedListener } from "../order-created.listener";

const setUp = async () => {
  // Create an instance of listener
  const listener = new OrderCreatedListener(natsClient.client);

  // Create and save a ticket
  const ticket = Tickets.build({
    title: "ye concert",
    price: 99,
    userId: "bjdjcbdckjd",
  });
  await ticket.save();

  // Create the fake data object
  const data: OrderCreatedEventInterface["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatusEnum.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("sets the orderId of the ticket", async () => {
  const { listener, data, msg, ticket } = await setUp();
  await listener.onMessage(data, msg);

  const updatedTicket = await Tickets.findById(ticket.id);

  expect(updatedTicket).toBeDefined();

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, msg } = await setUp();
  await listener.onMessage(data, msg);

  expect(natsClient.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsClient.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
