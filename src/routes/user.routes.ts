import express, { Router } from "express";
import { AuthController, UserController } from "../controller";
import { authMiddleware, AuthMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate";
import { payValidation, signInValidation, signUpValidation, subscribeValidation } from "../validations/auth.validation";

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post("/subscribe/:assetId", validateRequest(subscribeValidation), AuthMiddleware.withRoles(['*']).verifyUser, UserController.prototype.subscribe);
    this.router.post("/pay", validateRequest(payValidation), AuthMiddleware.withRoles(['member']).verifyUser, UserController.prototype.pay);
    this.router.post("/top-up/:assetUserId", validateRequest(payValidation), AuthMiddleware.withRoles(['member']).verifyUser, UserController.prototype.topUp);
    this.router.get("/portfolio", AuthMiddleware.withRoles(['admin', 'member']).verifyUser, UserController.prototype.portfolio);
    this.router.post("/redeem/:assetUserId", AuthMiddleware.withRoles(['member']).verifyUser, UserController.prototype.redeemAsset);
    this.router.get("/asset/transaction-history/:userUssetId", AuthMiddleware.withRoles(['member']).verifyUser, UserController.prototype.assetTransactionHistory);
    // this.router.get("/transaction-history", AuthMiddleware.withRoles(['member']).verifyUser, UserController.prototype.transactionHistory);
    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
