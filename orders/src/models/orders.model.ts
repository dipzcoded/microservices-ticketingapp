import { OrderStatusEnum } from "@realmtickets/common";
import mongoose, { Schema } from "mongoose";
import {
  OrdersModelInterface,
  OrdersSchemaDocumentInterface,
  OrdersSchemaInterface,
} from "../interfaces";

const orderSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatusEnum),
      default: OrderStatusEnum.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tickets",
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

orderSchema.statics.build = (attrs: OrdersSchemaInterface) => {
  return new Orders(attrs);
};

const Orders = mongoose.model<
  OrdersSchemaDocumentInterface,
  OrdersModelInterface
>("Orders", orderSchema);

export default Orders;
