import { TeamModel } from "./models/team.schema";
import teams from '../teams.json'
import { FixtureModel } from "./models/fixture.schema";
import moment from "moment";
import Utils from "./utils/helper.utils";

const seedDb = {
  seedTeam: async () => {
    try {
      const count = await TeamModel.countDocuments({})
      if(count < 1){
        await TeamModel.insertMany(teams.teams)
        return true
      }
      else{
        return false
      }
    } catch (error) {
      console.log(error);
    }
  },
  insertFixtures: async() => {
    const allTeams = await TeamModel.find({});
    const fixturePromises = [];
  
    for (let homeTeam of allTeams) {
      for (let awayTeam of allTeams) {
        if (awayTeam._id !== homeTeam._id) {
          const randSelector1 = Utils.getRandomInt(0, 1);
          fixturePromises.push(
            FixtureModel.create({
              homeTeam: homeTeam._id,
              awayTeam: awayTeam._id,
              ...(randSelector1 > 0 && {
                homeTeamGoals: Utils.getRandomInt(0, 5),
                awayTeamGoals: Utils.getRandomInt(0, 5),
                kickOffTime: moment().subtract(Utils.getRandomInt(0, 100), 'days'),
              }),
              ...(randSelector1 === 0 && {
                kickOffTime: moment().add(Utils.getRandomInt(0, 100), 'days'),
              }),
            })
          );
        }
      }
    }
    await Promise.all(fixturePromises);
  }
};

export default seedDb;
