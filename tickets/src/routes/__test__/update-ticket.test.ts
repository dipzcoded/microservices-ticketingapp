import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { natsClient } from "../../nats-wrapper.utils";

it("returns a 404 if the provided ticket id does not exist", async () => {
  const mongoId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${mongoId}`)
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "Ye concert",
      price: 200,
    })
    .expect(404);
});
it("returns a 401 if the user is not authenticated", async () => {
  const mongoId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${mongoId}`)
    .send({
      title: "Ye concert",
      price: 200,
    })
    .expect(401);
});
it("returns 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "Ye concert",
      price: 200,
    });

  await request(app)
    .put(`/api/tickets/${response.body.ticket.id}`)
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "Dipz concert",
      price: 1000,
    })
    .expect(403);
});
it("returns a 400 if the user provided an invalid price or title", async () => {
  const cookie = global.getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Ye concert",
      price: 200,
    });

  await request(app)
    .put(`/api/tickets/${response.body.ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "ye concert",
      price: -9,
    })
    .expect(400);
});
it("updates the ticket provided valid ticket", async () => {
  const cookie = global.getAuthCookie();
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Ye concert",
      price: 200,
    });

  await request(app)
    .put(`/api/tickets/${response.body.ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "damn dude",
      price: 1000,
    })
    .expect(200);

  response = await request(app)
    .get(`/api/tickets/${response.body.ticket.id}`)
    .send({})
    .expect(200);
  expect(response.body.ticket.title).toEqual("damn dude");
  expect(response.body.ticket.price).toEqual(1000);
});

it("publishes an event", async () => {
  const cookie = global.getAuthCookie();
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Ye concert",
      price: 200,
    });

  await request(app)
    .put(`/api/tickets/${response.body.ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "damn dude",
      price: 1000,
    })
    .expect(200);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
