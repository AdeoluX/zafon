import { Document, Schema, Types, model } from "mongoose";

// (first_name, last_name, email, phone)

// user interface
export interface IComment extends Document {
  content: string;
  author_id: Types.ObjectId;
}

// user schema
const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// create and export user model
export const CommentModel = model<IComment>("Comment", CommentSchema);
