import { Message } from "node-nats-streaming";
import {
  Listener,
  NotFoundError,
  SubjectsEvent,
  TicketUpdatedEventInterface,
} from "@realmtickets/common";
import { orderServiceQueueGroupName } from "./queue-group";
import { Tickets } from "../../models";

export class TicketUpdatedListener extends Listener<TicketUpdatedEventInterface> {
  subject: SubjectsEvent.TicketUpdated = SubjectsEvent.TicketUpdated;
  queueGroupName: string = orderServiceQueueGroupName;
  async onMessage(
    data: {
      id: string;
      title: string;
      price: number;
      userId: string;
      version: number;
    },
    msg: Message
  ): Promise<void> {
    const ticket = await Tickets.findByEvent({
      id: data.id,
      version: data.version,
    });
    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
