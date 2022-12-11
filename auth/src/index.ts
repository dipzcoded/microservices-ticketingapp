import { app } from "./app";
// db init
import { dbInit } from "./db";

const PORT = 3200;

const appInit = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Env not found!");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Mongo Uri Env not found!");
  }

  await dbInit();
  app.listen(PORT, () => {
    console.log(`auth service listening on port: ${PORT}`);
  });
};

appInit();
