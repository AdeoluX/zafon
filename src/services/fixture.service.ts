import Utils from "../utils/helper.utils";
import {
  ICreateFixture,
  IQuery,
  ServiceRes,
} from "./types/app.types";
import moment from "moment";
import { FixtureModel, IFixture } from "../models/fixture.schema";
import { ILink, LinkModel } from "../models/link.schema";

export class FixtureService {
  public async create(payload: ICreateFixture): Promise<ServiceRes> {
    const { awayTeam, homeTeam, kickOffTime } = payload;
    if(awayTeam === homeTeam) return {
      success: false,
      message: "A team cannot play itself."
    }
    let fixture = await FixtureModel.create({
      awayTeam,
      homeTeam,
      kickOffTime
    })
    return {
      success: true,
      message: "Fixture created successfully",
      data: fixture,
    }

  }

  public async read({ params = null, query }: { params: string | null; query: IQuery }): Promise<ServiceRes> {
    const searchQuery: any = {
        ...((query?.startDate && query?.endDate) && {
            kickOffTime: {
                $gte: new Date(query.startDate),
                $lte: new Date(query.endDate)
            }
        }),
        ...(query.status === 'completed' && {
            homeTeamGoals: { $ne: null },
            awayTeamGoals: { $ne: null }
        }),
        ...(query.status === 'pending' && {
            homeTeamGoals: { $eq: null },
            awayTeamGoals: { $eq: null }
        }),
        ...(params && { _id: params }),
        deletedAt: null
    };

    const aggregationPipeline: any = [
        { $match: searchQuery },
        {
            $lookup: {
                from: 'teams',
                localField: 'homeTeam',
                foreignField: '_id',
                as: 'homeTeam'
            }
        },
        {
            $lookup: {
                from: 'teams',
                localField: 'awayTeam',
                foreignField: '_id',
                as: 'awayTeam'
            }
        },
        { $unwind: '$homeTeam' },
        { $unwind: '$awayTeam' },
        ...(query?.search ? [
            {
                $match: {
                    $or: [
                        { 'homeTeam.name': { $regex: query.search, $options: 'i' } },
                        { 'awayTeam.name': { $regex: query.search, $options: 'i' } }
                    ]
                }
            }
        ] : []),
        {
            $project: {
                _id: 1,
                homeTeam: '$homeTeam.name',
                awayTeam: '$awayTeam.name',
                kickOffTime: 1,
                awayTeamGoals: 1,
                homeTeamGoals: 1
            }
        },
        { $sort: { kickOffTime: -1 } },
        { $skip: query?.skip}, 
        { $limit: query?.perPage} 
    ];

    const fixtures = await FixtureModel.aggregate(aggregationPipeline);

    const countPipeline = aggregationPipeline.slice(0, -2); 
    const totalFixturesCount = await FixtureModel.aggregate([...countPipeline, { $count: 'totalCount' }]);
    const countFixture = totalFixturesCount.length > 0 ? totalFixturesCount[0].totalCount : 0;

    return {
        success: true,
        message: "Fixtures retrieved successfully",
        data: fixtures,
        options: {
            currentPage: query.page,
            totalCount: countFixture,
            totalPages: Math.ceil(countFixture / query.perPage)
        }
    };
  }

  public async update({fixtureId, payload}:{fixtureId: string; payload: ICreateFixture}): Promise<ServiceRes> {
    let fixture: IFixture| null = await FixtureModel.findById(fixtureId)
    if(!fixture || fixture.deletedAt) return {
      success: false,
      message: "Fixture does not exist."
    }
    const existingNoGoals = !fixture.homeTeamGoals && !fixture.awayTeamGoals;
    const payloadHasNoGoals = !payload.homeTeamGoals || !payload.awayTeamGoals;
    if (existingNoGoals && payloadHasNoGoals) {
        return {
            success: false,
            message: 'Please update goals for both teams.'
        };
    }
    fixture = await FixtureModel.findByIdAndUpdate(fixtureId, {
      ...payload
    }, { new: true })
    return {
      success: true,
      data: fixture?.toJSON(),
      message: 'Fixture updated successfully.'
    }
  }

  public async delete({fixtureId}:{fixtureId: string}): Promise<ServiceRes> {
    let fixture: IFixture | null = await FixtureModel.findById(fixtureId)
    if(!fixture || fixture.deletedAt) return {
      success: false,
      message: "Fixture does not exist."
    }
    fixture = await FixtureModel.findByIdAndUpdate(fixtureId, {
      deletedAt: moment()
    }, { new: true })
    return {
      success: true,
      message: 'Fixture deleted successfully.'
    }
  }

  public async generateFixtureLink({fixtureId}: {fixtureId: string}): Promise<ServiceRes> {
    let fixture: IFixture | null = await FixtureModel.findById(fixtureId)
    if(!fixture || fixture.deletedAt) return {
      success: false,
      message: "Fixture does not exist."
    }
    let link = await LinkModel.create({
      fixture: fixture._id,
      uniqueLink: `fxtr-${Utils.generateString({alpha: true, number: true})}`
    })
    return {
      success: true,
      message: 'Link generated successfully.',
      data: link
    }
  }

  public async getFixtureLinks({fixtureId}: {fixtureId: string}): Promise<ServiceRes> {
    let fixture: IFixture | null = await FixtureModel.findById(fixtureId)
    if(!fixture || fixture.deletedAt) return {
      success: false,
      message: "Fixture does not exist."
    }
    let links = await LinkModel.find({
      fixture: fixture._id,
    })
    return {
      success: true,
      message: 'Link generated successfully.',
      data: links
    }
  }

  public async getFixtureViaLink({link}: {link: string}): Promise<ServiceRes>{
    let _link: ILink | null = await LinkModel.findOne({
      uniqueLink: link
    }).populate('fixture')
    if(!_link) return {
      success: false,
      message: "Fixture does not exist."
    }
    return {
      success: true,
      message: 'Link generated successfully.',
      data: _link
    }
  }

}
