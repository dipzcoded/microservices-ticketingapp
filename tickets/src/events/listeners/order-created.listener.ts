import {
  Listener,
  NotFoundError,
  OrderCreatedEventInterface,
  OrderStatusEnum,
  SubjectsEvent,
} from "@realmtickets/common";
import { Message } from "node-nats-streaming";
import { Tickets } from "../../models";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";
import { ticketServiceQueueGroupName } from "./queue-group";

export class OrderCreatedListener extends Listener<OrderCreatedEventInterface> {
  subject: SubjectsEvent.OrderCreated = SubjectsEvent.OrderCreated;
  queueGroupName: string = ticketServiceQueueGroupName;
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
    // find the ticket that the order is reserving
    const ticket = await Tickets.findById(data.ticket.id);

    // if no ticket, throw error

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    // mark the ticket has being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // save the ticket

    await ticket.save();

    // publish ticket:updated event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    // ack the message
    msg.ack();
  }
}
