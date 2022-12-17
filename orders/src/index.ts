import { app } from "./app";
// db init
import { dbInit } from "./db";

import { natsClient } from "./nats-wrapper.utils";
import { TicketCreatedListener, TicketUpdatedListener } from "./events";

const PORT = 3600;

const appInit = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Env not found!");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI Env not found!");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID Env not found!");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID Env not found!");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL Env not found!");
  }

  try {
    await natsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    const stan = natsClient.client;
    stan.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => stan.close());
    process.on("SIGTERM", () => stan.close());

    new TicketCreatedListener(stan).listen();
    new TicketUpdatedListener(stan).listen();

    await dbInit();
  } catch (error) {
    console.error(error);
  }

  app.listen(PORT, () => {
    console.log(`order service listening on port: ${PORT}`);
  });
};

appInit();
