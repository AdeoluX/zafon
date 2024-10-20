import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../utils/error-handler";
import Utils from "../utils/helper.utils";
import { redisClient } from "../config/redis";

export class AuthMiddleware {
  constructor(private allowedRoles: string[] = []) {
    this.verifyUser = this.verifyUser.bind(this);
  }
  public async verifyUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.headers?.authorization) {
      throw new NotAuthorizedError(
        "Token is not available. Please login again."
      );
    }
    try {
      const BearerToken = req.headers?.authorization.split(" ")[1];
      if (!BearerToken) {
        throw new NotAuthorizedError(
          "Token is not available. Please login again."
        );
      }
      const payload: any = Utils.verifyToken(BearerToken);

      if (!payload) {
        throw new NotAuthorizedError(
          "You do not have permission to perform this action."
        );
      }
      const sessionData = await redisClient.get(`session:${payload.id}`);
      if (!sessionData) {
        throw new NotAuthorizedError(
          "Session has expired. Please login again."
        );
      }
      const parsedSessionData = JSON.parse(sessionData);
      if (this.allowedRoles.length > 0 && !this.allowedRoles.includes(parsedSessionData.role)) {
        throw new NotAuthorizedError(
          "You do not have permission to perform this action."
        );
      }
      req.body = {
        ...req.body,
        authorizer: parsedSessionData,
      };
    } catch (error) {
      next(new NotAuthorizedError("You do not have permission to perform this action. Please login."));
    }
    next();
  }
  public static withRoles(allowedRoles: string[]): AuthMiddleware {
    return new AuthMiddleware(allowedRoles);
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
