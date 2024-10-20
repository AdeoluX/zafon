import express, { Router } from "express";
import { TeamController } from "../controller";
import { authMiddleware, AuthMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate";
import { createTeamValidation, updateTeamValidation } from "../validations/team.validation";
import { searchFixtureValidation } from "../validations/fixture.validation";

class TeamRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post("/",  AuthMiddleware.withRoles(['admin']).verifyUser, validateRequest(createTeamValidation), TeamController.prototype.create);
    this.router.get("/:teamId?", AuthMiddleware.withRoles(['admin', 'user']).verifyUser, validateRequest(searchFixtureValidation), TeamController.prototype.read);
    this.router.put("/:teamId", AuthMiddleware.withRoles(['admin']).verifyUser, validateRequest(updateTeamValidation), TeamController.prototype.update);
    this.router.delete("/:teamId", AuthMiddleware.withRoles(['admin']).verifyUser, TeamController.prototype.delete);
    return this.router;
  }
}

export const teamRoutes: TeamRoutes = new TeamRoutes();
