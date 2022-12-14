import { OrderStatusEnum } from "@realmtickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose, { Schema } from "mongoose";
import {
  TicketsModelInterface,
  TicketsSchemaDocumentInterface,
  TicketsSchemaInterface,
} from "../interfaces";
import Orders from "./orders.model";

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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

// adding method to the model
ticketSchema.statics.build = (attr: TicketsSchemaInterface) => {
  return new Tickets({
    _id: attr.id,
    title: attr.title,
    price: attr.price,
  });
};

ticketSchema.statics.findByEvent = (data: { id: string; version: number }) => {
  return Tickets.findOne({ _id: data.id, version: data.version - 1 });
};

// adding method to document
ticketSchema.methods.isReserved = async function () {
  // this === current ticket document that is been called
  const existingOrder = await Orders.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatusEnum.Complete,
        OrderStatusEnum.AwaitingPayment,
        OrderStatusEnum.Created,
      ],
    },
  });

  return !!existingOrder;
};

const Tickets = mongoose.model<
  TicketsSchemaDocumentInterface,
  TicketsModelInterface
>("Tickets", ticketSchema);
export default Tickets;
