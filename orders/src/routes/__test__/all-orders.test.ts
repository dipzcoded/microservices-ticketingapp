import request from "supertest";
import { app } from "../../app";
import { Orders, Tickets } from "../../models";

const createTicket = async () => {
  const ticket = Tickets.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();
  return ticket;
};

it("fetches order for a particular user", async () => {
  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThree = await createTicket();

  const userOne = global.getAuthCookie();
  const userTwo = global.getAuthCookie();

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketTwo.id,
    })
    .expect(201);

  const { body: orderThree } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketThree.id,
    })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .send({})
    .expect(200);
  expect(response.body.orders.length).toEqual(2);
  expect(response.body.orders[0].id).toEqual(orderTwo.order.id);
  expect(response.body.orders[1].id).toEqual(orderThree.order.id);
  expect(response.body.orders[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body.orders[1].ticket.id).toEqual(ticketThree.id);
});
