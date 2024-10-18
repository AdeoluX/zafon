import express, { Router } from "express";
import { FixtureController } from "../controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate";
import { searchFixtureValidation, createFixtureValidation, updateFixtureValidation } from "../validations/fixture.validation";

class FixtureRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post("/", AuthMiddleware.withRoles(['admin']).verifyUser, validateRequest(createFixtureValidation), FixtureController.prototype.create);
    this.router.get("/:fixtureId?", AuthMiddleware.withRoles(['admin', 'user']).verifyUser, validateRequest(searchFixtureValidation), FixtureController.prototype.read);
    this.router.put("/:fixtureId", AuthMiddleware.withRoles(['admin']).verifyUser, validateRequest(updateFixtureValidation), FixtureController.prototype.update);
    this.router.delete("/:fixtureId", AuthMiddleware.withRoles(['admin']).verifyUser, FixtureController.prototype.delete);

    //link
    this.router.post("/generate-link/:fixtureId", AuthMiddleware.withRoles(['admin']).verifyUser, FixtureController.prototype.generateLink);
    this.router.get("/links/:fixtureId", AuthMiddleware.withRoles(['admin', 'user']).verifyUser, FixtureController.prototype.getFixtureLinks);
    this.router.get("/link/:link", AuthMiddleware.withRoles(['admin', 'user']).verifyUser, FixtureController.prototype.getFixtureViaLink);

    return this.router;
  }
}

export const fixtureRoutes: FixtureRoutes = new FixtureRoutes();
