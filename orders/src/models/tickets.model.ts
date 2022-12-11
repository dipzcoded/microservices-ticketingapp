import mongoose, { Schema } from "mongoose";
import {
  TicketsModelInterface,
  TicketsSchemaDocumentInterface,
  TicketsSchemaInterface,
} from "../interfaces";

const ticketSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attr: TicketsSchemaInterface) => {
  return new Tickets(attr);
};

const Tickets = mongoose.model<
  TicketsSchemaDocumentInterface,
  TicketsModelInterface
>("Tickets", ticketSchema);
export default Tickets;
