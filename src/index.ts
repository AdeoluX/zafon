import express, { Express } from "express";
import { Server as MainServer } from "./setupServer";
import { config } from "./config";
import databaseConnection from "./setupDatabase";

class Application {
  public loadConfig(): void {
    config.validateConfig();
  }
}

/*=============================================
=           initialize():              =
=============================================*/
const app: Express = express();
const application: Application = new Application();
application.loadConfig();
// databaseConnection();
// application.handleExit();

const server: MainServer = new MainServer(app);
databaseConnection.connect();
server.start();

// for aws lamda function
export { app };
