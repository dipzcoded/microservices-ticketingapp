import request from "supertest";
import { app } from "../../app";
import { Tickets } from "../../models";
import { natsClient } from "../../nats-wrapper.utils";

it("has a route hanler listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("only be accessed if user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "ye Concert",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "ye Concert",
    })
    .expect(400);
});

it("create a ticket with valid inputs", async () => {
  // add in a check to make sure a ticket was saved
  let tickets = await Tickets.find({});
  expect(tickets.length).toEqual(0);

  const title = "Ye concert";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({ title, price: 2000 })
    .expect(201);

  tickets = await Tickets.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(2000);
  expect(tickets[0].title).toEqual(title);
});

it("publishes an event", async () => {
  const title = "Ye concert";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({ title, price: 2000 })
    .expect(201);
  expect(natsClient.client.publish).toHaveBeenCalled();
});
