import { BlackListModel } from "../models/blacklist.schema"
import Utils from "../utils/helper.utils"
import {IAddressPayload, IBlacklistPayload, IPaginate, IprofileUser, ServiceRes} from"./types/auth.types"
export class BlacklistService {
    async getBVNstatus(bvn: String): Promise<ServiceRes> {
        const blacklist = await BlackListModel.findOne({
            bvn
        })
        if(!blacklist) return { success: true, message: "No record found" }
        return {
            success: true,
            message: "Record retreived successful",
            data: blacklist
        }
    }
    async reportBVN(payload: IBlacklistPayload): Promise<ServiceRes> {
        const findBlackList = await BlackListModel.findOne({
            bvn: payload.bvn
        })
        if(findBlackList) return {success: true, message: "Stored successfully and processing", data: findBlackList.toJSON()}
        const createBlackList = await BlackListModel.create(payload)
        return {success: true, message: "Stored successfully and processing", data: createBlackList.toJSON() }
    }
    async getAllBvnReports(paginateOptions: IPaginate): Promise<ServiceRes> {
        const { limit, offset } = paginateOptions
        const getAll = await BlackListModel.find().skip(offset).limit(limit)
        return {
            success: true,
            message: "Records gotten successfully",
            data: {list: getAll, limit, offset}
        }
    }
}