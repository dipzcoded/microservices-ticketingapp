import {
  Publisher,
  SubjectsEvent,
  TicketUpdatedEventInterface,
} from "@realmtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEventInterface> {
  readonly subject: SubjectsEvent.TicketUpdated = SubjectsEvent.TicketUpdated;
}
