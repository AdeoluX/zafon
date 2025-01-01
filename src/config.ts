import dotenv from "dotenv";
import bunyan from "bunyan";

dotenv.config({});

class Config {
  public DATABASE_URL: string;
  public TOKEN_SECRET: string;
  public FRONTEND_URL: string;
  public REDIS_PORT: number;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || "";
    this.TOKEN_SECRET = process.env.TOKEN_SECRET || "qwertyuiop";
    this.FRONTEND_URL = process.env.FRONTEND_URL || "";
    this.REDIS_PORT = Number(process.env.REDIS_PORT) || 7000;
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: "debug" });
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }
}

export const config: Config = new Config();
