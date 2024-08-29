import { NextFunction, Request, Response } from "express";
import ApiResponse from '../utils/api-response'
import { BlacklistService } from "../services/blacklist.service";
import { IBlacklistPayload, IAddressPayload, IprofileUser, IsignIn, IPaginate } from "../services/types/auth.types";
import Utils from "../utils/helper.utils";
const { created, customError, ok, response } = ApiResponse;
export class Blacklist{
    public async getBVNstatus(req: Request, res: Response, next: NextFunction){
        try {
            const bvn: String = req.params.bvn;
            const { success, message, data } = await BlacklistService.prototype.getBVNstatus(bvn)
            if (!success) return customError(res, 400, message);
            return ok(
                res,
                data,
                message
            );
        } catch (error) {
            next(error);
        }
    }
    public async reportBVN(req: Request, res: Response, next: NextFunction){
        try {
            const payload: IBlacklistPayload = req.body;
            const { success, message, data } = await BlacklistService.prototype.reportBVN(payload)
            if (!success) return customError(res, 400, message);
            return ok(
                res,
                data,
                message
            );
        } catch (error) {
            next(error);
        }
    }
    public async getAllBvnReports(req: Request, res: Response, next: NextFunction){
        try {
            const paginateOptions: IPaginate = Utils.paginateOptions(req)
            const { success, message, data } = await BlacklistService.prototype.getAllBvnReports(paginateOptions)
            if (!success) return customError(res, 400, message);
            return ok(
                res,
                data,
                message
            );
        } catch (error) {
            next(error);
        }
    }
}