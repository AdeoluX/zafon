import express, { Express } from "express";
import { Server as MainServer } from "./setupServer";
import { config } from "./config";
import databaseConnection from "./setupDatabase";
import { seed } from "./utils/seeder";
import { agenda } from "./queues/redemption.queue";

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

(async () => {
  try {
    await agenda.start();
    console.log('Agenda started and ready to process jobs.');
  } catch (error) {
    console.error('Failed to start Agenda:', error);
  }
})();

const server: MainServer = new MainServer(app);
// seed.seedAssets()
// seed.seedAdmin()
databaseConnection.connect();
server.start();


export { app };