import express, { Router } from "express";
import { BlacklistController } from "../controller";
import { authMiddleware } from "../middleware/auth.middleware";

class BlacklistRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get("/:idNo", authMiddleware.verifyApiRequest, BlacklistController.prototype.getBVNstatus);
    this.router.post("/", authMiddleware.verifyApiRequest, BlacklistController.prototype.reportBVN);
    this.router.get("/", authMiddleware.verifyApiRequest, BlacklistController.prototype.getAllBvnReports);


    return this.router;
  }
}

export const blacklistRoutes: BlacklistRoutes = new BlacklistRoutes();
