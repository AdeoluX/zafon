import mongoose from "mongoose";
import { config } from "./config";

const db = {
  connect: async () => {
    try {
      await mongoose.connect(
        config.DATABASE_URL // databaseNameHere
      );
      console.log("database connection successfully");
    } catch (error) {
      console.log(error);
    }
  },
};

export default db;
