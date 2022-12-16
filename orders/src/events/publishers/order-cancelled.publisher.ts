import {
  OrderCancelledEventInterface,
  SubjectsEvent,
  Publisher,
} from "@realmtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEventInterface> {
  subject: SubjectsEvent.OrderCancelled = SubjectsEvent.OrderCancelled;
}
