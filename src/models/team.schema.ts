import { Document, Schema, Types, model } from "mongoose";

interface Istanding {
  week: number;
  MP: number;
  GF: number;
  GA: number;
  GD: number;
  W: number;
  L: number;
  D: number;
  Pts: number;
}
export interface ITeam extends Document {
  name: string;
  coach: string;
  deletedAt: Date;
}

const TeamSchema: Schema<ITeam> = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
    },
    coach: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const TeamModel = model<ITeam>("Team", TeamSchema);
