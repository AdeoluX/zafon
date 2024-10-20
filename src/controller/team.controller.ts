import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/api-response";
import { ICreateTeam, Ipagination } from "../services/types/app.types";
import Utils from "../utils/helper.utils";
import { TeamService } from "../services/team.service";
const { created, customError, ok } = ApiResponse;

export class TeamController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: ICreateTeam = req.body;
      const { success, message, data } = await TeamService.prototype.create(
        payload
      );
      if (!success) return customError(res, 400, message);
      return created(
        res,
        { data },
        message
      );
    } catch (error) {
      next(error);
    }
  }

  public async read(req: Request, res: Response, next: NextFunction) {
    try {
      const query: any = req.query
      const teamId : string = req.params.teamId
      const paginate: Ipagination = Utils.paginateOptions(query)
      const { success, message, data, options } = await TeamService.prototype.read({
        params: teamId,
        query: {...query, ...paginate}
      })
      if (!success) return customError(res, 400, message);
      return ok(
        res,
        {data, ...options},
        message
      );
    } catch (error) {
      next(error);
    }
  }
  
  public async update(req: Request, res: Response, next: NextFunction) {
    try{
      const payload: ICreateTeam = req.body;
      const teamId: string = req.params.teamId;
      const { success, message, data } = await TeamService.prototype.update({
        teamId, payload
      })
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

  public async delete(req: Request, res: Response, next: NextFunction) {
    try{
      const teamId: string = req.params.teamId;
      const { success, message, data } = await TeamService.prototype.delete({teamId});
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
