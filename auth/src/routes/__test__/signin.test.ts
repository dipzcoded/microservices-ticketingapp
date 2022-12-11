import request from "supertest";
import { app } from "../../app";

it("fails when an email or username does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      uniqueId: "damn101",
      password: "passowrd",
    })
    .expect(401);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      username: "bukkylove",
      email: "bukkylove@mail.com",
      password: "password101",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      uniqueId: "bukkylove",
      password: "pass10111",
    })
    .expect(401);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      username: "bukkylove",
      email: "bukkylove@mail.com",
      password: "password101",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      uniqueId: "bukkylove",
      password: "password101",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
