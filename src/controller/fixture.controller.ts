import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/api-response";
import { ICreateFixture, Ipagination } from "../services/types/app.types";
import Utils from "../utils/helper.utils";
import { FixtureService } from "../services/fixture.service";
const { created, customError, ok } = ApiResponse;

export class FixtureController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: ICreateFixture = req.body;
      const { success, message, token, data } = await FixtureService.prototype.create(
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
      const fixtureId : string = req.params.fixtureId
      const paginate: Ipagination = Utils.paginateOptions(query)
      const { success, message, token, data, options } = await FixtureService.prototype.read({
        params: fixtureId,
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
      const payload: ICreateFixture = req.body;
      const fixtureId: string = req.params.fixtureId;
      const { success, message, token, data } = await FixtureService.prototype.update({
        fixtureId, payload
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
      const fixtureId: string = req.params.fixtureId;
      const { success, message, token, data } = await FixtureService.prototype.delete({fixtureId});
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

  public async generateLink(req: Request, res: Response, next: NextFunction) {
    try{
      const fixtureId: string = req.params.fixtureId;
      const { success, message, data } = await FixtureService.prototype.generateFixtureLink({fixtureId});
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

  public async getFixtureLinks(req: Request, res: Response, next: NextFunction) {
    try{
      const fixtureId: string = req.params.fixtureId;
      const { success, message, data } = await FixtureService.prototype.getFixtureLinks({fixtureId});
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

  public async getFixtureViaLink(req: Request, res: Response, next: NextFunction) {
    try{
      const link: string = req.params.link;
      const { success, message, data } = await FixtureService.prototype.getFixtureViaLink({link});
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
