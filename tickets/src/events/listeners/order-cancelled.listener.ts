import {
  Listener,
  NotFoundError,
  OrderCancelledEventInterface,
  SubjectsEvent,
} from "@realmtickets/common";
import { Message } from "node-nats-streaming";
import { Tickets } from "../../models";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";
import { ticketServiceQueueGroupName } from "./queue-group";

export class OrderCancelledListener extends Listener<OrderCancelledEventInterface> {
  subject: SubjectsEvent.OrderCancelled = SubjectsEvent.OrderCancelled;
  queueGroupName: string = ticketServiceQueueGroupName;
  async onMessage(
    data: { id: string; version: number; ticket: { id: string } },
    msg: Message
  ): Promise<void> {
    const ticket = await Tickets.findById(data.ticket.id);

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      userId: ticket.userId,
      title: ticket.title,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
