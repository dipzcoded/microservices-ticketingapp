import {
  Listener,
  NotFoundError,
  OrderCancelledEventInterface,
  OrderStatusEnum,
  SubjectsEvent,
} from "@realmtickets/common";
import { Message } from "node-nats-streaming";
import { Orders } from "../../models";
import { paymentServiceQueueGroupName } from "./queue-group";

export class OrderCancelledListener extends Listener<OrderCancelledEventInterface> {
  subject: SubjectsEvent.OrderCancelled = SubjectsEvent.OrderCancelled;
  queueGroupName: string = paymentServiceQueueGroupName;
  async onMessage(
    data: { id: string; version: number; ticket: { id: string } },
    msg: Message
  ): Promise<void> {
    const order = await Orders.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new NotFoundError("order not found");
    }

    order.set({ status: OrderStatusEnum.Cancelled });
    await order.save();

    msg.ack();
  }
}
