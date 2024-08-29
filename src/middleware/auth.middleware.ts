import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../utils/error-handler";
import { AuthPayload } from "../services/types/auth.types";
import Utils from "../utils/helper.utils";
import { CompanyModel, ICompany } from "../models/company.schema";

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
        // if(payload?.status && payload?.status !== 'active'){
        //   throw new NotAuthorizedError(
        //     "Token is not available. Please login again."
        //   );
        // }
        req.body = {
          ...req.body,
          authorizer: payload,
        };
      }
    } catch (error) {
      next(new NotAuthorizedError("Token is invalid. Please login again."));
    }
    next();
  }
  public async verifyApiRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.headers?.authorization) {
      throw new NotAuthorizedError(
        "Invalid credentials."
      );
    }
    try {
      const BearerToken = req.headers?.authorization.split(" ")[1];
      if (req.headers?.authorization) {
        const company: ICompany | null = await CompanyModel.findOne({
          $or: [
            { api_secret_test_key: BearerToken },
            { api_secret_live_key: BearerToken }
          ]
        })
        if (!company) {
          throw new NotAuthorizedError(
            "Invalid credentials."
          );
        }
        req.body = {
          ...req.body,
          authorizer: company,
        };
      }
    } catch (error) {
      next(new NotAuthorizedError("Invalid credentials."));
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
