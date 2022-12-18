import { Model, Document } from "mongoose";
import { OrderStatusEnum } from "@realmtickets/common";
import { TicketsSchemaDocumentInterface } from "../interfaces";

// An interface that describes the properties of a tickets documents
export interface OrdersSchemaDocumentInterface extends Document {
  userId: string;
  status: OrderStatusEnum;
  expiresAt: Date;
  ticket: TicketsSchemaDocumentInterface;
  version: number;
}

// An interface that describes the properties that are required to create a new user
export interface OrdersSchemaInterface {
  userId: OrdersSchemaDocumentInterface["userId"];
  status: OrdersSchemaDocumentInterface["status"];
  expiresAt: OrdersSchemaDocumentInterface["expiresAt"];
  ticket: OrdersSchemaDocumentInterface["ticket"];
}

// An interface that describes the properties that a user model has
export interface OrdersModelInterface
  extends Model<OrdersSchemaDocumentInterface> {
  build(attrs: OrdersSchemaInterface): OrdersSchemaDocumentInterface;
}
