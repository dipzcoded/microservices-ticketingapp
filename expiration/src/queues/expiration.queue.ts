import Queue from "bull";
import { ExpirationCompletePublisher } from "../events";
import { natsClient } from "../nats-wrapper.utils";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(natsClient.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
