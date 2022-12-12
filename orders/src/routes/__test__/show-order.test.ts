import request from "supertest";
import { app } from "../../app";
import { Tickets } from "../../models";

it("fetches an order by id", async () => {
  const ticket = Tickets.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const currentUser = global.getAuthCookie();

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", currentUser)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${orderOne.order.id}`)
    .set("Cookie", currentUser)
    .send({})
    .expect(200);

  expect(fetchedOrder.order.id).toEqual(orderOne.order.id);
});

it("returns an error when a user try to fetch another users orders", async () => {
  const ticket = Tickets.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const currentUser = global.getAuthCookie();
  const currentUser2 = global.getAuthCookie();

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", currentUser)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .get(`/api/orders/${orderOne.order.id}`)
    .set("Cookie", currentUser2)
    .send({})
    .expect(403);
});
