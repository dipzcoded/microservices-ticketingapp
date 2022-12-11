import {
  Publisher,
  SubjectsEvent,
  TicketCreatedEventInterface,
} from "@realmtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventInterface> {
  subject: SubjectsEvent.TickectCreated = SubjectsEvent.TickectCreated;
}
