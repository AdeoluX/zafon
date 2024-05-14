import { Document, Schema, Types, model } from "mongoose";

// (first_name, last_name, email, phone)

// user interface
export interface IPost extends Document {
  image: [string];
  content: string;
  author_id: Types.ObjectId;
  likes: [Ilike];
  comments: [any];
}

interface Ilike {
  liker_id: Types.ObjectId;
}

// user schema
const PostSchema = new Schema<IPost>(
  {
    image: Array,
    content: {
      type: String,
      required: true,
    },
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        liker_id: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// create and export user model
export const PostModel = model<IPost>("Post", PostSchema);
