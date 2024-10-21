import request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from '../src';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ITeam } from '../src/models/team.schema';

const authRoute = '/api/v1/auth';
const teamRoute = '/api/v1/team';
const jestTimeout = 15000
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
const coachName: string = faker.person.fullName();
const teamName: string = `${faker.word.noun()} FC`;
let team: ITeam;

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
        password,
        isAdmin: true
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
        password: userPassword,
        isAdmin: false
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

  it('admin should create team', (done) => {
    request(app)
      .post(`${teamRoute}`)
      .set('Authorization', `Bearer ${adminBearerToken}`)
      .send({
        name: teamName,
        coach: coachName,
      })
      .then(response => {
        expect(response.status).toBe(201);
        done();
      })
      .catch(error => {
        done(error);
      });
  }, jestTimeout);

  it('user should fail to create team', (done) => {
    request(app)
      .post(`${teamRoute}`)
      .set('Authorization', `Bearer ${userBearerToken}`)
      .send({
        name: teamName,
        coach: coachName,
      })
      .then(response => {
        expect(response.status).toBe(401);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('admin should get all teams', (done) => {
    request(app)
      .get(`${teamRoute}`)
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

  it('admin should search team by name', (done) => {
    request(app)
      .get(`${teamRoute}?search=${teamName}`)
      .set('Authorization', `Bearer ${adminBearerToken}`)
      .send()
      .then(response => {
        team = response.body.data[0]
        expect(response.status).toBe(200);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('user should search team by name', (done) => {
    request(app)
      .get(`${teamRoute}?search=${teamName}`)
      .set('Authorization', `Bearer ${userBearerToken}`)
      .send()
      .then(response => {
        team = response.body.data[0]
        expect(response.status).toBe(200);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('admin should update team coach', (done) => {
    const coach = 'Pep Guardiola'
    request(app)
      .put(`${teamRoute}/${team._id}`)
      .set('Authorization', `Bearer ${adminBearerToken}`)
      .send({
        coach
      })
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.data.coach).toBe(coach);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('user should fail to update team coach', (done) => {
    const coach = 'Roberto Mancini'
    request(app)
      .put(`${teamRoute}/${team._id}`)
      .set('Authorization', `Bearer ${userBearerToken}`)
      .send({
        coach
      })
      .then(response => {
        expect(response.status).toBe(401);
        done();
      })
      .catch(error => {
        done(error);
      });
  });

  it('admin should delete team', (done) => {
    request(app)
      .delete(`${teamRoute}/${team._id}`)
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

  it('user should fail to delete team', (done) => {
    request(app)
      .delete(`${teamRoute}/${team._id}`)
      .set('Authorization', `Bearer ${userBearerToken}`)
      .send()
      .then(response => {
        expect(response.status).toBe(401);
        done();
      })
      .catch(error => {
        done(error);
      });
  });
});
