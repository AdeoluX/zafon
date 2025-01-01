import express, { Router } from "express";
import { WebhookController } from "../controller";

class WebhookRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post("/", WebhookController.prototype.webhook);
    return this.router;
  }
}

export const webhookRoutes: WebhookRoutes = new WebhookRoutes();
