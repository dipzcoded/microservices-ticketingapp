import mongoose, { Schema } from "mongoose";
import {
  TicketsModelInterface,
  TicketsSchemaDocumentInterface,
  TicketsSchemaInterface,
} from "../interfaces";

const ticketsSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketsSchema.statics.build = (attrs: TicketsSchemaInterface) => {
  return new Tickets(attrs);
};

const Tickets = mongoose.model<
  TicketsSchemaDocumentInterface,
  TicketsModelInterface
>("Tickets", ticketsSchema);

export default Tickets;