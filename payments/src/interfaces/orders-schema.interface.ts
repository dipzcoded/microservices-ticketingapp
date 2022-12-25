import { Model, Document } from "mongoose";
import { OrderStatusEnum } from "@realmtickets/common";

// An interface that describes the properties of a tickets documents
export interface OrdersSchemaDocumentInterface extends Document {
  id: string;
  userId: string;
  status: OrderStatusEnum;
  version: number;
  price: number;
}

// An interface that describes the properties that are required to create a new user
export interface OrdersSchemaInterface {
  id: OrdersSchemaDocumentInterface["id"];
  userId: OrdersSchemaDocumentInterface["userId"];
  status: OrdersSchemaDocumentInterface["status"];
  price: OrdersSchemaDocumentInterface["price"];
  version: OrdersSchemaDocumentInterface["version"];
}

// An interface that describes the properties that a user model has
export interface OrdersModelInterface
  extends Model<OrdersSchemaDocumentInterface> {
  build(attrs: OrdersSchemaInterface): OrdersSchemaDocumentInterface;
}
