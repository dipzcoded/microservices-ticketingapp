import { OrderStatusEnum } from "@realmtickets/common";
import mongoose, { Schema } from "mongoose";
import {
  OrdersModelInterface,
  OrdersSchemaDocumentInterface,
  OrdersSchemaInterface,
} from "../interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const orderSchema: Schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatusEnum),
    },

    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrdersSchemaInterface) => {
  return new Orders({
    _id: attrs.id,
    price: attrs.price,
    version: attrs.version,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Orders = mongoose.model<
  OrdersSchemaDocumentInterface,
  OrdersModelInterface
>("Orders", orderSchema);

export default Orders;
