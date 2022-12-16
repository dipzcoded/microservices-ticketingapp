import {
  Publisher,
  SubjectsEvent,
  OrderCreatedEventInterface,
} from "@realmtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEventInterface> {
  subject: SubjectsEvent.OrderCreated = SubjectsEvent.OrderCreated;
}
