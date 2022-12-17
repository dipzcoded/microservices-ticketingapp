import { OrderStatusEnum } from "@realmtickets/common";
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

// adding method to the model
ticketSchema.statics.build = (attr: TicketsSchemaInterface) => {

  return new Tickets({
    _id : attr.id,
    title : attr.title,
    price: attr.price
  });
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
