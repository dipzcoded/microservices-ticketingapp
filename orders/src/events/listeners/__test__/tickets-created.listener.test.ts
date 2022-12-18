import { TicketCreatedListener } from "../ticket-created.listener";
import { natsClient } from "../../../nats-wrapper.utils";
import { TicketCreatedEventInterface } from "@realmtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Tickets } from "../../../models";
const setUp = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsClient.client);
  // create a fake data event
  const data: TicketCreatedEventInterface["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ye concert",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  //   @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it("creates and saves a ticket", async () => {
  const { listener, data, message } = await setUp();
  // call the onMessage function with the data object + message Object
  await listener.onMessage(data, message);
  // write assertions to make sure the ticket was created
  const ticket = await Tickets.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, message } = await setUp();
  // call the onMessage function with the data object + message Object
  await listener.onMessage(data, message);

  // write assertions to make sure the ack function is called
  expect(message.ack).toHaveBeenCalled();
});
