import { OrderStatusEnum } from "@realmtickets/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Orders } from "../../models";
import { stripe } from "../../stripe-wrapper.utils";

// jest.mock("../../stripe-wrapper.utils");

it("returns a 404 when when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie())
    .send({
      token: "anskjasasjhi",
      orderId: new mongoose.Types.ObjectId(),
    })
    .expect(404);
});
it("returns a 403 when purchasing an order that does not belong to the current loggedin user", async () => {
  const userOneId = new mongoose.Types.ObjectId().toHexString();

  const newOrder = Orders.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userOneId,
    price: 300,
    status: OrderStatusEnum.Created,
    version: 0,
  });
  await newOrder.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie())
    .send({ token: "absjbsbj", orderId: newOrder.id })
    .expect(403);
});
it("returns a 401 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const newOrder = Orders.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 300,
    status: OrderStatusEnum.Cancelled,
    version: 0,
  });

  await newOrder.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie(userId))
    .send({ token: "absjbsbj", orderId: newOrder.id })
    .expect(401);
});

it("returns a 201 with valid inputs", async () => {
  const userOneId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const newOrder = Orders.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userOneId,
    price,
    status: OrderStatusEnum.Created,
    version: 0,
  });
  await newOrder.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie(userOneId))
    .send({
      token: "tok_visa",
      orderId: newOrder.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const chargeFound = stripeCharges.data.find(
    (el) => el.amount === newOrder.price * 100
  );
  expect(chargeFound).toBeDefined();
  expect(chargeFound!.currency).toEqual("usd");
});
