import { NextFunction, Request, Response } from "express";
import ApiResponse from '../utils/api-response'

export class Company{
    private createdResponse = ApiResponse.created
    private response = ApiResponse.response
    private ok = ApiResponse.ok
    private customError = ApiResponse.customError
    
    public async create(req: Request, res: Response, next: NextFunction ){
        try{
            return this.createdResponse(res, {}, '')
        }catch(error){
            next(error)
        }
    }
}