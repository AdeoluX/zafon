import request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from '../src';
import mongoose from 'mongoose';

let server: any;
const jestTimeout = 10000
const authRoute = '/api/v1/auth';
const password: string = faker.internet.password({length: 8});
const firstName: string = faker.person.firstName();
const lastName: string = faker.person.lastName();
const middleName: string = faker.person.middleName();
const email: string = faker.internet.email({
  firstName,
  lastName,
  provider: "gmail.com"
})

const userPassword: string = faker.internet.password({length: 8});
const userFirstName: string = faker.person.firstName();
const userLastName: string = faker.person.lastName();
const userMiddleName: string = faker.person.middleName();
const userEmail: string = faker.internet.email({
  firstName: userFirstName,
  lastName: userLastName,
  provider: "gmail.com"
})

let BearerToken: string;

describe('Express App', () => {

  afterAll(async () => {
    if (mongoose.connection.db && mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    
  });
  it('should sign admin up', async () => {
    const response = await request(app).post(`${authRoute}/sign-up`)
                                       .send({
                                        email,
                                        password,
                                        confirmPassword: password,
                                        phoneNumber: faker.phone.number({style: 'national'}),
                                        firstName,
                                        lastName,
                                        middleName,
                                        isAdmin: true
                                       })
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  }, jestTimeout);

  it('should sign admin in', async () => {
    const response = await request(app)
      .post(`${authRoute}/sign-in`)
      .send({
        email,
        password
      });

    expect(response.status).toBe(200);
    expect(typeof response.body.data.token).toBe('string')
  }, jestTimeout);

  it('should sign user up', async () => {
    const response = await request(app).post(`${authRoute}/sign-up`)
                                       .send({
                                        email: userEmail,
                                        password: userPassword,
                                        confirmPassword: userPassword,
                                        phoneNumber: faker.phone.number({style: 'national'}),
                                        firstName: userFirstName,
                                        lastName: userLastName,
                                        middleName: userMiddleName,
                                        isAdmin: true
                                       })
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  }, jestTimeout);

  it('should sign user in', async () => {
    const response = await request(app)
      .post(`${authRoute}/sign-in`)
      .send({
        email: userEmail,
        password: userPassword
      });

    expect(response.status).toBe(200);
  }, jestTimeout);
});
