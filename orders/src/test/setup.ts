import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import jwt from "jsonwebtoken";

// declaring a global variable
declare global {
  var getAuthCookie: () => string[];
}

let mongo: any;

jest.mock("../nats-wrapper.utils");

beforeAll(async () => {
  jest.setTimeout(30 * 1000);
  process.env.JWT_SECRET = "dgdcacscaghdjhwy489y8wdkjcNdkjah";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
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

global.getAuthCookie = () => {
  //  Build a JWT payload. {id,username,email}

  const payload = {
    user: {
      id: new mongoose.Types.ObjectId().toHexString(),
      username: "dipzcoded",
      email: "dipoakerele@gmail.com",
    },
  };

  // Create JsonWebToken
  const myToken = jwt.sign(payload, process.env.JWT_SECRET!);

  // Build Session Object i.e {jwt: MY_JWT}

  const session = { jwt: myToken };

  // Turn that session into JSON

  const sessionJson = JSON.stringify(session);

  // take JSON and encode it as bas64
  const base64 = Buffer.from(sessionJson).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
