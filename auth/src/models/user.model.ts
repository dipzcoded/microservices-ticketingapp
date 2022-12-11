import mongoose, { Schema } from "mongoose";
import {
  UserSchemaInterface,
  UserModelInterface,
  UserSchemaDocumentInterface,
} from "../interfaces";

import { Password } from "../utils";

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// pre hook middleware runs before the document is saved in the database
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

// static method associated wit the user schema
userSchema.statics.build = (attrs: UserSchemaInterface) => {
  return new User(attrs);
};

const User = mongoose.model<UserSchemaDocumentInterface, UserModelInterface>(
  "User",
  userSchema
);

export default User;
