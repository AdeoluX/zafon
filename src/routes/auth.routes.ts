import express, { Router } from "express";
import { AuthController } from "../controller";
import { authMiddleware } from "../middleware/auth.middleware";

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post("/sign-in", AuthController.prototype.signIn);
    this.router.post("/sign-up", AuthController.prototype.signUp);
    this.router.post(
      "/forgot-password",
      AuthController.prototype.forgotPassword
    );
    this.router.post(
      "/activate-profile",
      authMiddleware.verifyUser,
      AuthController.prototype.activateProfile
    );
    this.router.post(
      "/change-password",
      AuthController.prototype.changePassword
    );
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
