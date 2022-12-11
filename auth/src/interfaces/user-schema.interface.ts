import { Model, Document } from "mongoose";

// An interface that describes the properties of a user documents
export interface UserSchemaDocumentInterface extends Document {
  username: string;
  email: string;
  password: string;
}

// An interface that describes the properties that are required to create a new user
export interface UserSchemaInterface {
  username: UserSchemaDocumentInterface["username"];
  email: UserSchemaDocumentInterface["email"];
  password: UserSchemaDocumentInterface["password"];
}

// An interface that describes the properties that a user model has
export interface UserModelInterface extends Model<UserSchemaDocumentInterface> {
  build(attrs: UserSchemaInterface): UserSchemaDocumentInterface;
}
