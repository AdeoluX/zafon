import express, { Router } from "express";
import { AuthController, UserController } from "../controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate";
import { signInValidation, signUpValidation, subscribeValidation } from "../validations/auth.validation";

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post("/subscribe/:assetId", validateRequest(subscribeValidation), UserController.prototype.subscribe);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
