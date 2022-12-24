import {
  Listener,
  SubjectsEvent,
  OrderCreatedEventInterface,
  OrderStatusEnum,
} from "@realmtickets/common";
import { Message } from "node-nats-streaming";
import { expirationServiceQueueGroupName } from "./queue-group";
import { expirationQueue } from "../../queues";

export class OrderCreatedListener extends Listener<OrderCreatedEventInterface> {
  subject: SubjectsEvent.OrderCreated = SubjectsEvent.OrderCreated;
  queueGroupName: string = expirationServiceQueueGroupName;
  async onMessage(
    data: {
      id: string;
      status: OrderStatusEnum;
      userId: string;
      expiresAt: string;
      version: number;
      ticket: { id: string; price: number };
    },
    msg: Message
  ): Promise<void> {
    // creating a job
    await expirationQueue.add({
      orderId: data.id,
    });

    msg.ack();
  }
}
