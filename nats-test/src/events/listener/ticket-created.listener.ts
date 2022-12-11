import { Message, Stan } from "node-nats-streaming";
import { Listener } from "../../class";
import { Subjects } from "../../enums";
import { TicketCreatedEventInterface } from "../../interfaces";

export class TicketCreatedListener extends Listener<TicketCreatedEventInterface> {
  readonly subject: Subjects.TickectCreated = Subjects.TickectCreated;
  queueGroupName: string = "payments-service";
  onMessage(data: TicketCreatedEventInterface["data"], msg: Message): void {
    console.log("Event data", data);
    msg.ack();
  }
}
