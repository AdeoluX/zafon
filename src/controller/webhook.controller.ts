import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/api-response";
import { Ipayment, IsignIn, IsignUp, Isubscribe } from "../services/types/app.types";
import { UserService } from "../services/user.service";
import { WebhookService } from "../services/webhook.service";
const { created, customError, ok, response } = ApiResponse;

export class WebhookController {
  public async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: Isubscribe = req.body;
      const { success, message, token } = await WebhookService.prototype.webhook(
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
}
