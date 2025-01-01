import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../utils/error-handler";
import Utils from "../utils/helper.utils";

export class AuthMiddleware {
  constructor(private allowedRoles: string[] = []) {
    this.verifyUser = this.verifyUser.bind(this);
  }

  public async verifyUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check for the Authorization header
      if (!req.headers?.authorization) {
        throw new NotAuthorizedError("Token is not available. Please login again.");
      }

      // Extract Bearer Token
      const BearerToken = req.headers.authorization.split(" ")[1];
      if (!BearerToken) {
        throw new NotAuthorizedError("Token is not available. Please login again.");
      }

      // Verify the token
      const payload: any = Utils.verifyToken(BearerToken);
      if (!payload) {
        throw new NotAuthorizedError("You do not have permission to perform this action.");
      }

      // Validate roles, if specified
      if (this.allowedRoles.length > 0 && !this.allowedRoles.includes(payload.role)) {
        throw new NotAuthorizedError("You do not have permission to perform this action.");
      }

      // Attach user details to request body
      req.body = {
        ...req.body,
        authorizer: payload,
      };

      next(); // Move to the next middleware or route handler
    } catch (error) {
      // Pass the error to the next middleware for centralized error handling
      next(error);
    }
  }

  public static withRoles(allowedRoles: string[]): AuthMiddleware {
    return new AuthMiddleware(allowedRoles);
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
