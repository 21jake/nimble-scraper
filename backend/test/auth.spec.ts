import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { generateRandomString } from 'src/utils/helpers';

import request from 'supertest';

describe('Authentication', () => {
  let app: INestApplication;
  let randomUsername: string;
  let randomPassword: string;
  let appRequest: request.SuperTest<request.Test>;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
    appRequest = request(app.getHttpServer());
  });

  beforeEach(() => {
    randomUsername = generateRandomString(32);
    randomPassword = generateRandomString(32);
  });

  it('Should be able to get a valid jwt when signing up', async () => {
    const signupReq = await appRequest
      .post('/api/signup')
      .send({ username: randomUsername, password: randomPassword, confirmPassword: randomPassword })
      .expect((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('id');
        expect(res.body.username).toBe(randomUsername);
      });

    const { token, id, username } = signupReq.body;
    await appRequest.get('/api/profile').set('Authorization', `Bearer ${token}`).expect(200).expect({ username, id });

    return await appRequest.get('/api/profile').expect(401);
  });

  it('Should be able to loggin with an account', async () => {
    await appRequest
      .post('/api/signup')
      .send({ username: randomUsername, password: randomPassword, confirmPassword: randomPassword });

    return await appRequest
      .post('/api/login')
      .send({ username: randomUsername, password: randomPassword })
      .expect((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
