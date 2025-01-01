import { Application } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { webhookRoutes } from "./webhook.routes";
import { assetRoutes } from "./asset.routes";


const BASE_PATH = "/api/v1";

export default (app: Application) => {
  const routes = () => {
    app.use(`${BASE_PATH}/auth`, authRoutes.routes());
    app.use(`${BASE_PATH}/user`, userRoutes.routes());
    app.use(`${BASE_PATH}/webhook`, webhookRoutes.routes());
    app.use(`${BASE_PATH}/asset`, assetRoutes.routes());

  };
  routes();
};
