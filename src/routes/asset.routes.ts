import express, { Router } from "express";
import { AssetController } from "../controller";
import { authMiddleware, AuthMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate";
import { createAssetValidation, payValidation, signInValidation, signUpValidation, subscribeValidation, updateAssetValidation } from "../validations/auth.validation";

class AssetRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get("/", AuthMiddleware.withRoles(['admin', 'member']).verifyUser, AssetController.prototype.getAssets);
    this.router.get("/:id", AuthMiddleware.withRoles(['admin', 'member']).verifyUser, AssetController.prototype.getAsset);
    this.router.post("/", validateRequest(createAssetValidation), AuthMiddleware.withRoles(['admin']).verifyUser, AssetController.prototype.createAsset);
    this.router.patch("/:id", validateRequest(updateAssetValidation), AuthMiddleware.withRoles(['admin']).verifyUser, AssetController.prototype.updateAssets);
    return this.router;
  }
}

export const assetRoutes: AssetRoutes = new AssetRoutes();
