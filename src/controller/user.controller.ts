import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/api-response";
import { IAuthorizer, Ipayment, IRedemption, IsignIn, IsignUp, Isubscribe } from "../services/types/app.types";
import { UserService } from "../services/user.service";
import Utils from "../utils/helper.utils";
const { created, customError, ok, response } = ApiResponse;

export class UserController {
  public async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: Isubscribe = req.body;
      const { success, message, token } = await UserService.prototype.subscribe(
        payload
      );
      if (!success) return customError(res, 400, message);
      return ok(
        res,
        { data: {token}},
        message
      );
    } catch (error) {
      next(error);
    }
  }

  public async pay(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: Partial<Ipayment> = req.body;
      const { success, message, token, data } = await UserService.prototype.pay(
        payload
      );
      if (!success) return customError(res, 400, message);
      return ok(
        res,
        { data },
        message
      );
    } catch (error) {
      next(error);
    }
  }
  
  public async topUp(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: Partial<Ipayment> = req.body;
      const assetUserId: string = req.params.assetUserId;
      const { success, message, token, data } = await UserService.prototype.topUp(
        payload, assetUserId
      );
      if (!success) return customError(res, 400, message);
      return ok(
        res,
        { data },
        message
      );
    } catch (error) {
      next(error);
    }
  }

  public async redeemAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: Partial<IRedemption> = req.body;
      const assetUserId: string = req.params.assetUserId
      const { success, message, token, data } = await UserService.prototype.redeemAsset(
        payload, assetUserId
      );
      if (!success) return customError(res, 400, message);
      return ok(
        res,
        { data },
        message
      );
    } catch (error) {
      next(error);
    }
  }

  public async assetTransactionHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userUssetId: string = req.params.userUssetId;
      const query: any = req.query;
      const paginate = Utils.paginateOptions(query)
      const { success, message, token, data } = await UserService.prototype.assetTransactionHistory(
        userUssetId, paginate
      );
      if (!success) return customError(res, 400, message);
      return ok(
        res,
        { data },
        message
      );
    } catch (error) {
      next(error);
    }
  }

  public async portfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: IAuthorizer = req.body.authorizer;
      const { success, message, data } = await UserService.prototype.portfolio(payload);
      if (!success) return customError(res, 400, message);
      return ok(
        res,
        { data },
        message
      );
    } catch (error) {
      next(error);
    }
  }
}
