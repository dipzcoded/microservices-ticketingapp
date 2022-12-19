import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Orders, Tickets } from "../../models";
import { OrderStatusEnum } from "@realmtickets/common";
import { natsClient } from "../../nats-wrapper.utils";
it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({
      ticketId,
    })
    .expect(404);
});
it("returns an error if the ticket is reserved", async () => {
  const ticket = Tickets.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const order = Orders.build({
    ticket,
    userId: "basashchjaggda",
    status: OrderStatusEnum.Created,
    expiresAt: new Date(),
  });

  await order.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(403);
});
it("reserves a ticket", async () => {
  const ticket = Tickets.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
