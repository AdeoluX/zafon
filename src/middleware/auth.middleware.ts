import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../utils/error-handler";
import { AuthPayload } from "../services/types/auth.types";
import Utils from "../utils/helper.utils";

// interface Request extends Request {
//   currentUser: Object;
// }

export class AuthMiddleware {
  public verifyUser(req: Request, res: Response, next: NextFunction): void {
    if (!req.headers?.authorization) {
      throw new NotAuthorizedError(
        "Token is not available. Please login again."
      );
    }
    try {
      const BearerToken = req.headers?.authorization.split(" ")[1];
      if (req.headers?.authorization) {
        const payload: AuthPayload = Utils.verifyToken(BearerToken);
        req.body = {
          ...req.body,
          authorizer: payload,
        };
      }
    } catch (error) {
      throw new NotAuthorizedError("Token is invalid. Please login again.");
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
