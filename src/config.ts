import dotenv from "dotenv";
import bunyan from "bunyan";
// import cloudinary from "cloudinary";

dotenv.config({});

class Config {
  public DATABASE_URL: string;
  public TOKEN_SECRET: string;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || "";
    this.TOKEN_SECRET = process.env.TOKEN_SECRET || "qwertyuiop";
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: "debug" });
  }

  public validateConfig(): void {
    // manual validation
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }
}

export const config: Config = new Config();
