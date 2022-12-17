import { Model, Document } from "mongoose";

// An interface that describes the properties of a tickets documents
export interface TicketsSchemaDocumentInterface extends Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

// An interface that describes the properties that are required to create a new user
export interface TicketsSchemaInterface {
  id: string;
  title: TicketsSchemaDocumentInterface["title"];
  price: TicketsSchemaDocumentInterface["price"];
}

// An interface that describes the properties that a user model has
export interface TicketsModelInterface
  extends Model<TicketsSchemaDocumentInterface> {
  build(attrs: TicketsSchemaInterface): TicketsSchemaDocumentInterface;
}
