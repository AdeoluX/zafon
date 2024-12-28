import express, { Express } from "express";
import { Server as MainServer } from "./setupServer";
import { config } from "./config";
import databaseConnection from "./setupDatabase";
import { seed } from "./utils/seeder";

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
seed.seedAssets()
databaseConnection.connect();
server.start();


export { app };