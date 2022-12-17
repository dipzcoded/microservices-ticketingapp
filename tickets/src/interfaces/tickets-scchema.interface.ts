import { Model, Document } from "mongoose";

// An interface that describes the properties of a tickets documents
export interface TicketsSchemaDocumentInterface extends Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

// An interface that describes the properties that are required to create a new user
export interface TicketsSchemaInterface {
  title: TicketsSchemaDocumentInterface["title"];
  price: TicketsSchemaDocumentInterface["price"];
  userId: TicketsSchemaDocumentInterface["userId"];
}

// An interface that describes the properties that a user model has
export interface TicketsModelInterface
  extends Model<TicketsSchemaDocumentInterface> {
  build(attrs: TicketsSchemaInterface): TicketsSchemaDocumentInterface;
}
