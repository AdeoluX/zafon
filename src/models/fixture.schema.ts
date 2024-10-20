import { Document, Schema, Types, model } from "mongoose";


export interface IFixture extends Document {
  homeTeam: Schema.Types.ObjectId;
  homeTeamGoals?: number|null;
  awayTeam: Schema.Types.ObjectId;
  awayTeamGoals?: number|null;
  kickOffTime: Date;
  deletedAt: Date;
}

const FixtureSchema : Schema<IFixture> = new Schema<IFixture>(
  {
    homeTeam: { 
      type: Schema.Types.ObjectId, 
      ref: 'Team', 
      required: true 
    },
    homeTeamGoals: {
      type: Number,
      default: null
    },
    awayTeam: { 
      type: Schema.Types.ObjectId, 
      ref: 'Team', 
      required: true 
    },
    awayTeamGoals: {
      type: Number,
      default: null
    },
    kickOffTime: { 
      type: Date, 
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


export const FixtureModel = model<IFixture>("Fixture", FixtureSchema);
