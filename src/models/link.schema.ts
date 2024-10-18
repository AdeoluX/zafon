import { Document, Schema, model } from "mongoose";

const BASE_URL = process.env.BASE_URL;

export interface ILink extends Document {
  fixture: Schema.Types.ObjectId;
  uniqueLink: string;
  url?: string;
}

const LinkSchema: Schema<ILink> = new Schema<ILink>(
  {
    fixture: {
      type: Schema.Types.ObjectId,
      ref: 'Fixture',
      required: true
    },
    uniqueLink: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    },
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
  }
);

LinkSchema.virtual('url').get(function () {
  return `${BASE_URL}/api/v1/fixture/link/${this.uniqueLink}`;
});
export const LinkModel = model<ILink>("Link", LinkSchema);
