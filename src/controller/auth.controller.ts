import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/api-response";
import {  ICompanyPayload, IsignIn, IsignUp } from "../services/types/auth.types";
import { AuthService } from "../services/auth.service";
const { created, customError, ok, response } = ApiResponse;

export class AuthController {
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: IsignIn = req.body;
      const { success, message, token } = await AuthService.prototype.signIn(
        payload
      );
      if (!success) return customError(res, 400, message);
      return ok(
        res,
        { token },
        success ? "Logged in Successfully" : "Invalid Credentials."
      );
    } catch (error) {
      next(error);
    }
  }

  public async registerCompany(req: Request, res: Response, next: NextFunction){
    try{
      const payload: ICompanyPayload = req.body
      const {success, data, message} = await AuthService.prototype.registerCompany(payload)
      if(!success) return customError(res, 400, message)
      return ok(
        res,
        data,
        message
      )
    }catch(error){
      next(error)
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { success, message, ...rest } =
        await AuthService.prototype.forgotPassword(req.body);
      if (!success) return customError(res, 400, message);
      return ok(res, { ...rest }, message);
    } catch (error) {
      next(error);
    }
  }

  public async activateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { success, message, ...rest } =
        await AuthService.prototype.activateProfile(req.body);
      if (!success) return customError(res, 400, message);
      return ok(res, { ...rest }, message);
    } catch (error) {
      next(error);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { success, message, ...rest } =
        await AuthService.prototype.changePassword(req.body);
      if (!success) return customError(res, 400, message);
      return ok(res, { ...rest }, message);
    } catch (error) {
      next(error);
    }
  }
}
