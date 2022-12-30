import {
  Listener,
  OrderCreatedEventInterface,
  OrderStatusEnum,
  SubjectsEvent,
} from "@realmtickets/common";
import { Message } from "node-nats-streaming";
import { paymentServiceQueueGroupName } from "./queue-group";
import { Orders } from "../../models";

export class OrderCreatedListener extends Listener<OrderCreatedEventInterface> {
  subject: SubjectsEvent.OrderCreated = SubjectsEvent.OrderCreated;
  queueGroupName: string = paymentServiceQueueGroupName;
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
    const order = Orders.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}
