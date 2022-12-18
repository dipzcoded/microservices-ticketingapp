import { Message } from "node-nats-streaming";
import {
  TicketCreatedEventInterface,
  Listener,
  SubjectsEvent,
} from "@realmtickets/common";
import { Tickets } from "../../models";
import { orderServiceQueueGroupName } from "./queue-group";

export class TicketCreatedListener extends Listener<TicketCreatedEventInterface> {
  subject: SubjectsEvent.TickectCreated = SubjectsEvent.TickectCreated;
  queueGroupName: string = orderServiceQueueGroupName;
  async onMessage(
    data: { id: string; title: string; price: number; userId: string,version:number },
    msg: Message
  ): Promise<void> {
    const { price, title, id } = data;
    const newTicket = Tickets.build({ title, price, id });
    await newTicket.save();

    msg.ack();
  }
}
