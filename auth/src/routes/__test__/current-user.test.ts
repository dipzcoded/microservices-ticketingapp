import request from "supertest";
import { app } from "../../app";

it("responds with details of loggedin user", async () => {
  const cookie = await getAuthCookie();

  const resResult = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(resResult.body.currentUser.email).toEqual("bukkylove@mail.com");
});

it("respond with null if not authenticated", async () => {
  const resResult = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(401);

  expect(resResult.body.errors[0].message).toEqual("Not authorized");
});
