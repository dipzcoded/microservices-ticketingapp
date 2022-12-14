import { OrderStatusEnum } from "@realmtickets/common";
import request from "supertest";
import { app } from "../../app";
import { Tickets } from "../../models";

it("marks an order as cancelled", async () => {
  const ticket = await Tickets.build({ title: "concert", price: 20 });
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
});

it.todo("emist a event when an order is cancelled");
