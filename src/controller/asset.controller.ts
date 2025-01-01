import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/api-response";
import { IAsset, Ipayment, IsignIn, IsignUp, Isubscribe } from "../services/types/app.types";
import { AssetService } from "../services/asset.service";
import Utils from "../utils/helper.utils";
const { created, customError, ok, response } = ApiResponse;

export class AssetController {
  public async getAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: string = req.params.id;
      const { success, message, token } = await AssetService.prototype.getAsset(
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

  public async createAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: IAsset = req.body;
      const { success, message, token, data } = await AssetService.prototype.createAsset(
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

  public async getAssets(req: Request, res: Response, next: NextFunction) {
    try {
      const query: any = req.query;
      const pagination = Utils.paginateOptions(query)
      const { success, message, token, data } = await AssetService.prototype.getAssets(
        pagination
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

  public async updateAssets(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: Partial<IAsset> = req.body;
      const { success, message, token, data } = await AssetService.prototype.updateAsset(
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
}
