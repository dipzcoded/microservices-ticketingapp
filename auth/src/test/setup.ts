import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

// declaring a global variable
declare global {
  var getAuthCookie: () => Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
  jest.setTimeout(30 * 1000);
  process.env.JWT_SECRET = "dgdcacscaghdjhwy489y8wdkjcNdkjah";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

global.getAuthCookie = async () => {
  const username = "bukkylove";
  const email = "bukkylove@mail.com";
  const password = "password101";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ username, email, password })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
};
