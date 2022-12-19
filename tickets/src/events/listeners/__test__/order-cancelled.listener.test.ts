import { OrderCancelledEventInterface } from "@realmtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Tickets } from "../../../models";
import { natsClient } from "../../../nats-wrapper.utils";
import { OrderCancelledListener } from "../order-cancelled.listener";

const setUp = async () => {
  const listener = new OrderCancelledListener(natsClient.client);

  const ticket = await Tickets.build({
    title: "ye concert",
    price: 20,
    userId: "mddbkjj",
  });

  ticket.orderId = new mongoose.Types.ObjectId().toHexString();
  await ticket.save();

  const data: OrderCancelledEventInterface["data"] = {
    id: ticket.orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { listener, data, msg, ticket } = await setUp();

  await listener.onMessage(data, msg);

  const updatedTicket = await Tickets.findById(ticket.id);
  expect(updatedTicket!.orderId).toBeUndefined();

  expect(natsClient.client.publish).toHaveBeenCalled();

  expect(msg.ack).toHaveBeenCalled();
});
