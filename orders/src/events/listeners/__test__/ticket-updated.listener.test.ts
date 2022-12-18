import { TicketCreatedEventInterface } from "@realmtickets/common";
import mongoose from "mongoose";
import { natsClient } from "../../../nats-wrapper.utils";
import { TicketCreatedListener } from "../ticket-created.listener";

const setUp = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsClient.client);

  // create and save a ticket

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

it("finds, updates and saves a ticket", async () => {});

it("acks the message", async () => {});
