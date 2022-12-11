import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      username: "bukkylove",
      email: "bukkylove101@mail.com",
      password: "password101",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      username: "damnMe",
      email: "dddbuttlord",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      username: "damnMe",
      email: "dddbuttlord@mail.com",
      password: "pas",
    })
    .expect(400);
});

it("returns a 400 with an invalid username", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "dddbuttlord@mail.com",
      password: "password",
    })
    .expect(400);
});

it("disallows duplicate emails and usernames", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      username: "bukkylove",
      email: "bukkyLove@mail.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      username: "bukkylove",
      email: "bukkyLove@mail.com",
      password: "password",
    })
    .expect(403);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      username: "bukkylove",
      email: "bukkyLove@mail.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
