import express, { Express } from "express";
import { Server as MainServer } from "./setupServer";
import { config } from "./config";
import databaseConnection from "./setupDatabase";
import seeder from "./seeder"

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

// seeder.seedTeam().then((result) => {
//   if(result){
//     seeder.insertFixtures()
//   }
// })

export { app };
