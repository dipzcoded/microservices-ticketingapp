import { natsClient } from "./nats-wrapper.utils";


const appInit = async () => {
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
  } catch (error) {
    console.error(error);
  }
};

appInit();
