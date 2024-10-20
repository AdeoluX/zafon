import { Application } from "express";
import { authRoutes } from "./auth.routes";
import { teamRoutes } from "./team.routes";
import { fixtureRoutes } from "./fixture.routes";


const BASE_PATH = "/api/v1";

export default (app: Application) => {
  const routes = () => {
    app.use(`${BASE_PATH}/auth`, authRoutes.routes());
    app.use(`${BASE_PATH}/team`, teamRoutes.routes());
    app.use(`${BASE_PATH}/fixture`, fixtureRoutes.routes());

  };
  routes();
};
