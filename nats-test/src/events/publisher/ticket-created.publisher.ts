import { Stan } from "node-nats-streaming";
import { Publisher } from "../../class";
import { Subjects } from "../../enums";
import { TicketCreatedEventInterface } from "../../interfaces";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventInterface> {
  subject: Subjects.TickectCreated = Subjects.TickectCreated;
}
