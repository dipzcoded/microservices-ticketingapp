import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events";

console.clear();
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "Ye concert",
  //   price: 20,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("event published!");
  // });

  try {
    await new TicketCreatedPublisher(stan).publish({
      id: "123",
      price: "200",
      title: "Ye concert",
    });
  } catch (error) {
    console.log(error);
  }
});
