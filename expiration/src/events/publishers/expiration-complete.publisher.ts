import {
  Publisher,
  ExpirationCompleteEventInterface,
  SubjectsEvent,
} from "@realmtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEventInterface> {
  subject: SubjectsEvent.ExpirationComplete = SubjectsEvent.ExpirationComplete;
}
