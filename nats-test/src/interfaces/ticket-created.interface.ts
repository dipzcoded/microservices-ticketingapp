import { Subjects } from "../enums";
import { Event } from "./event.interface";

export interface TicketCreatedEventInterface extends Event {
  subject: Subjects.TickectCreated;
  data: {
    id: string;
    title: string;
    price: string;
  };
}
