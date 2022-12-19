import { OrderStatusEnum } from "@realmtickets/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Tickets } from "../../models";
import { natsClient } from "../../nats-wrapper.utils";

it("marks an order as cancelled", async () => {
  const ticket = await Tickets.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = global.getAuthCookie();
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${orderOne.order.id}`)
    .set("Cookie", user)
    .send({})
    .expect(204);

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${orderOne.order.id}`)
    .set("Cookie", user)
    .send({})
    .expect(200);
  expect(fetchOrder.order.status).toEqual(OrderStatusEnum.Cancelled);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
