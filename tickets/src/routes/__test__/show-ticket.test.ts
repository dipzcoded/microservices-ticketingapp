import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns a 404 if the ticket is not found", async () => {
  const mongoId = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${mongoId}`).send({}).expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "Ye concert";
  const price = 200;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/tickets/${response.body.ticket.id}`)
    .send({})
    .expect(200);

  expect(ticketRes.body.ticket.title).toEqual(title);
  expect(ticketRes.body.ticket.price).toEqual(price);
});
