import { TicketUpdatedEventInterface } from "@realmtickets/common";
import mongoose from "mongoose";
import { Tickets } from "../../../models";
import { natsClient } from "../../../nats-wrapper.utils";
import { TicketUpdatedListener } from "../ticket-updated.listener";

const setUp = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsClient.client);

  // create and save a ticket
  const ticket = Tickets.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Ye concert",
    price: 30,
  });

  await ticket.save();

  // create a fake data event
  const data: TicketUpdatedEventInterface["data"] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: "damn dd",
    price: 450,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  //   @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message, ticket };
};

it("finds, updates and saves a ticket", async () => {
  const { data, listener, message, ticket } = await setUp();

  await listener.onMessage(data, message);
  const updatedTicket = await Tickets.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { data, listener, message, ticket } = await setUp();

  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { message, data, listener, ticket } = await setUp();

  data.version = 10;

  try {
    await listener.onMessage(data, message);
  } catch (error) {}

  expect(message.ack).not.toHaveBeenCalled();
});
