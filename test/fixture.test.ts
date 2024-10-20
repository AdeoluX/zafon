import request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from '../src';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ITeam, TeamModel } from '../src/models/team.schema';
import moment from 'moment';
import { IFixture } from '../src/models/fixture.schema';
import { ILink } from '../src/models/link.schema';

const authRoute = '/api/v1/auth';
const fixtureRoute = '/api/v1/fixture';
const jestTimeout = 10000
const password: string = faker.internet.password({ length: 8 });
const firstName: string = faker.person.firstName();
const lastName: string = faker.person.lastName();
const middleName: string = faker.person.middleName();
const email: string = faker.internet.email({
  firstName,
  lastName,
  provider: "gmail.com"
});

const userPassword: string = faker.internet.password({ length: 8 });
const userFirstName: string = faker.person.firstName();
const userLastName: string = faker.person.lastName();
const userMiddleName: string = faker.person.middleName();
const userEmail: string = faker.internet.email({
  firstName: userFirstName,
  lastName: userLastName,
  provider: "gmail.com"
});

let manCity: ITeam;
let manUtd: ITeam;
let fixture: IFixture;
let link: ILink;

let userBearerToken: string, adminBearerToken: string;

describe('Express App', () => {
  afterAll(async () => {
    if (mongoose.connection.db && mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  beforeAll(async () => {
    manCity = await TeamModel.create(
      {
        coach: 'Pep Guardiola',
        name: 'Manchester City'
      }
    )

    manUtd = await TeamModel.create(
      {
        coach: 'Eric Ten Hag',
        name: 'Manchester United'
      }
    )
  }, jestTimeout)

  it('should sign admin up', (done) => {
    request(app)
      .post(`${authRoute}/sign-up`)
      .send({
        email,
        password,
        confirmPassword: password,
        phoneNumber: faker.phone.number({ style: 'national' }),
        firstName,
        lastName,
        middleName,
        isAdmin: true
      })
      .then(response => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        done(); // Call done when the test is complete
      })
      .catch(error => {
        done(error); // Call done with an error to fail the test
      });
  }, jestTimeout);

  it('should sign admin in', (done) => {
    request(app)
      .post(`${authRoute}/sign-in`)
      .send({
        email,
        password
      })
      .then(response => {
        adminBearerToken = response.body.data.token;
        expect(response.status).toBe(200);
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('should sign user up', (done) => {
    request(app)
      .post(`${authRoute}/sign-up`)
      .send({
        email: userEmail,
        password: userPassword,
        confirmPassword: userPassword,
        phoneNumber: faker.phone.number({ style: 'national' }),
        firstName: userFirstName,
        lastName: userLastName,
        middleName: userMiddleName,
        isAdmin: false
      })
      .then(response => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('should sign user in', (done) => {
    request(app)
      .post(`${authRoute}/sign-in`)
      .send({
        email: userEmail,
        password: userPassword
      })
      .then(response => {
        userBearerToken = response.body.data.token;
        expect(response.status).toBe(200);
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('admin should create fixture', (done) => {
    request(app)
      .post(`${fixtureRoute}`)
      .set('Authorization', `Bearer ${adminBearerToken}`)
      .send({
        homeTeam: manCity._id,
        awayTeam: manUtd._id,
        kickOffTime: moment().add(2, 'days')
      })
      .then(response => {
        fixture = response.body.data;
        expect(response.status).toBe(201);
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('user should fail to create fixture', (done) => {
    request(app)
      .post(`${fixtureRoute}`)
      .set('Authorization', `Bearer ${userBearerToken}`)
      .send({
        homeTeam: manCity._id,
        awayTeam: manUtd._id,
        kickOffTime: moment()
      })
      .then(response => {
        expect(response.status).toBe(401);
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('admin should fail to create fixture with same team id', (done) => {
    request(app)
      .post(`${fixtureRoute}`)
      .set('Authorization', `Bearer ${adminBearerToken}`)
      .send({
        homeTeam: manCity._id,
        awayTeam: manCity._id,
        kickOffTime: moment()
      })
      .then(response => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('A team cannot play itself.')
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('admin should fail to create fixture without "kickOffTime"', (done) => {
    request(app)
      .post(`${fixtureRoute}`)
      .set('Authorization', `Bearer ${adminBearerToken}`)
      .send({
        homeTeam: manCity._id,
        awayTeam: manUtd._id,
      })
      .then(response => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("\"kickOffTime\" is required")
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('admin should fail to update fixture with only one team score', (done) => {
    request(app)
      .put(`${fixtureRoute}/${fixture._id}`)
      .set('Authorization', `Bearer ${adminBearerToken}`)
      .send({
        homeTeamGoals: 2,
      })
      .then(response => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Please update goals for both teams.")
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('admin should update fixture successfully.', (done) => {
    request(app)
      .put(`${fixtureRoute}/${fixture._id}`)
      .set('Authorization', `Bearer ${adminBearerToken}`)
      .send({
        homeTeamGoals: 2,
        awayTeamGoals: 4
      })
      .then(response => {
        expect(response.status).toBe(200);
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('user should fail to update fixture successfully.', (done) => {
    request(app)
      .put(`${fixtureRoute}/${fixture._id}`)
      .set('Authorization', `Bearer ${userBearerToken}`)
      .send({
        homeTeamGoals: 2,
        awayTeamGoals: 4
      })
      .then(response => {
        expect(response.status).toBe(401);
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('user should get fixtures successfully.', (done) => {
    request(app)
      .get(`${fixtureRoute}`)
      .set('Authorization', `Bearer ${userBearerToken}`)
      .send()
      .then(response => {
        expect(response.status).toBe(200);
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('admin should get fixtures successfully.', (done) => {
    request(app)
      .get(`${fixtureRoute}`)
      .set('Authorization', `Bearer ${adminBearerToken}`)
      .send()
      .then(response => {
        expect(response.status).toBe(200);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('admin should get one fixture successfully.', (done) => {
    request(app)
      .get(`${fixtureRoute}/${fixture._id}`)
      .set('Authorization', `Bearer ${adminBearerToken}`)
      .send()
      .then(response => {
        expect(response.status).toBe(200);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('admin should generate fixture link.', (done) => {
    request(app)
      .post(`${fixtureRoute}/generate-link/${fixture._id}`)
      .set('Authorization', `Bearer ${adminBearerToken}`)
      .send()
      .then(response => {
        link = response.body.data;
        expect(response.status).toBe(201);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('user should fail to generate fixture link.', (done) => {
    request(app)
      .post(`${fixtureRoute}/generate-link/${fixture._id}`)
      .set('Authorization', `Bearer ${userBearerToken}`)
      .send()
      .then(response => {
        expect(response.status).toBe(401);
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('user should get links by fixture id.', (done) => {
    request(app)
      .get(`${fixtureRoute}/links/${fixture._id}`)
      .set('Authorization', `Bearer ${userBearerToken}`)
      .send()
      .then(response => {
        expect(response.status).toBe(200);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('user should get fixture by link id.', (done) => {
    request(app)
      .get(`${fixtureRoute}/link/${link.uniqueLink}`)
      .set('Authorization', `Bearer ${userBearerToken}`)
      .send()
      .then(response => {
        expect(response.status).toBe(200);
        done();
      })
      .catch(error => {
        done(error);
      });
  });
});
