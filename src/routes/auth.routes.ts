import express, { Router } from "express";
import { AuthController } from "../controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate";
import { signInValidation, signUpValidation } from "../validations/auth.validation";

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post("/sign-in", validateRequest(signInValidation), AuthController.prototype.signIn);
    this.router.post("/sign-up", validateRequest(signUpValidation), AuthController.prototype.signUp);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
