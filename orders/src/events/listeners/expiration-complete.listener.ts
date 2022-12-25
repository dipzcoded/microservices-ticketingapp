import {
  ExpirationCompleteEventInterface,
  Listener,
  NotFoundError,
  OrderStatusEnum,
  SubjectsEvent,
} from "@realmtickets/common";
import { Message } from "node-nats-streaming";
import { Orders } from "../../models";
import { OrderCancelledPublisher } from "../publishers/order-cancelled.publisher";
import { orderServiceQueueGroupName } from "./queue-group";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEventInterface> {
  subject: SubjectsEvent.ExpirationComplete = SubjectsEvent.ExpirationComplete;
  queueGroupName: string = orderServiceQueueGroupName;
  async onMessage(data: { orderId: string }, msg: Message): Promise<void> {
    const order = await Orders.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    order.set({
      status: OrderStatusEnum.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
