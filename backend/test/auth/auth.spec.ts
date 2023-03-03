import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { generateRandomString } from 'src/utils/helpers';

import * as request from 'supertest';

describe('Authentication', () => {
  let app: INestApplication;
  let randomUsername: string;
  let randomPassword: string;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    randomUsername = generateRandomString(32);
    randomPassword = generateRandomString(32);
  });

  it('Should be able to get a valid jwt when signing up', async () => {
    const signupReq = await request(app.getHttpServer())
      .post('/api/signup')
      .send({ username: randomUsername, password: randomPassword, confirmPassword: randomPassword })
      .expect((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('id');
        expect(res.body.username).toBe(randomUsername);
      });

    const { token, id, username } = signupReq.body;
    await request(app.getHttpServer())
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({ username, id });

    return await request(app.getHttpServer()).get('/api/profile').expect(401);
  });

  it('Should be able to loggin with an account', async () => {
    await request(app.getHttpServer())
      .post('/api/signup')
      .send({ username: randomUsername, password: randomPassword, confirmPassword: randomPassword });

    return await request(app.getHttpServer())
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
