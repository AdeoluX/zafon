import {
  ICreateTeam,
  IQuery,
  ServiceRes,
} from "./types/app.types";
import { ITeam, TeamModel } from "../models/team.schema";
import moment from "moment";

export class TeamService {
  public async create(payload: ICreateTeam): Promise<ServiceRes> {
    const { coach, name } = payload;
    let team = await TeamModel.findOne(
      {name: { $regex: name, $options: 'i' }},
    )
    if(team) return {
      success: false,
      message: "Team name taken."
    }
    team = await TeamModel.create({
      name,
      coach
    })
    return {
      success: true,
      message: "Team created successfully",
      data: team,
    }

  }

  public async read({ params = null, query }: { params: string | null; query: IQuery }): Promise<ServiceRes> {
    const searchQuery = {
      ...((query?.startDate && query?.endDate) && { createdAt : {
          $gte: new Date(query.startDate),
          $lte: new Date(query.endDate)
      }}),
      ...(query?.search && {name: { $regex: query.search, $options: 'i' }}),
      ...(params && {_id: params}),
      deletedAt: null
    }
    const teams = await TeamModel.find(searchQuery)
                                      .skip(query?.skip) 
                                      .limit(query.perPage)
                                      .exec();
    const countTeams = await TeamModel.countDocuments(searchQuery)
    return {
        success: true,
        message: "Teams gotten successfully",
        data: teams,
        options: {
            currentPage: query.page,
            totalCount: countTeams,
            totalPages: Math.ceil(countTeams/query.perPage)
        }
    }
  }

  public async update({teamId, payload}:{teamId: string; payload: ICreateTeam}): Promise<ServiceRes> {
    let team: ITeam | null = await TeamModel.findById(teamId)
    if(!team || team.deletedAt) return {
      success: false,
      message: "Team does not exist."
    }
    team = await TeamModel.findByIdAndUpdate(teamId, {
      ...payload
    }, { new: true })
    return {
      success: true,
      data: team?.toJSON(),
      message: 'Team updated successfully.'
    }
  }

  public async delete({teamId}:{teamId: string}): Promise<ServiceRes> {
    let team: ITeam | null = await TeamModel.findById(teamId)
    if(!team || team.deletedAt) return {
      success: false,
      message: "Team does not exist."
    }
    team = await TeamModel.findByIdAndUpdate(teamId, {
      deletedAt: moment()
    }, { new: true })
    return {
      success: true,
      message: 'Team deleted successfully.'
    }
  }

}
