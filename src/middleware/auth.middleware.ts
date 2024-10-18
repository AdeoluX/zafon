import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../utils/error-handler";
import Utils from "../utils/helper.utils";


export class AuthMiddleware {
  constructor(private allowedRoles: string[] = []) {
    this.verifyUser = this.verifyUser.bind(this);
  }

  public verifyUser(req: Request, res: Response, next: NextFunction): void {
    if (!req.headers?.authorization) {
      throw new NotAuthorizedError(
        "Token is not available. Please login again."
      );
    }
    try {
      const BearerToken = req.headers?.authorization.split(" ")[1];
      if (req.headers?.authorization) {
        const payload: any = Utils.verifyToken(BearerToken);
        
        if (!payload) {
          throw new NotAuthorizedError(
            "You do not have permission to perform this action."
          );
        }

        if (this?.allowedRoles?.length > 0 && !this?.allowedRoles?.includes(payload?.role)) {
          throw new NotAuthorizedError(
            "You do not have permission to perform this action."
          );
        }

        req.body = {
          ...req.body,
          authorizer: payload,
        };
      }
    } catch (error) {
      throw new NotAuthorizedError("You do not have permission to perform this action. Please login.");
    }
    next();
  }

  public static withRoles(allowedRoles: string[]): AuthMiddleware {
    return new AuthMiddleware(allowedRoles);
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
