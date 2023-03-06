import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { keywords as testKeywords, testKeywordPref, user, batch } from 'src/database/unit-test.data';
import { SortType } from 'src/dto/base-query.dto';
import { KeywordQueryDto } from 'src/dto/file-query.dto';
import { User } from 'src/entities/user.entity';
import { generateRandomString } from 'src/utils/helpers';

import request from 'supertest';

describe('File queries', () => {
  let loggedUser: User;
  let token: string;
  const testPw = '123456';
  let app: INestApplication;
  const apiPrefix = '/api/file';

  let appRequest: request.SuperTest<request.Test>;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();

    appRequest = request(app.getHttpServer());

    const loginReq = await appRequest.post('/api/login').send({ username: user.username, password: testPw });

    token = loginReq.body.token;
    loggedUser = { ...loginReq.body };
  });

  it('Authenticated user should be able to get a list of uploaded records', async () => {
    await appRequest.get(`${apiPrefix}/batches`).expect((res) => {
      expect(res.status).toBe(401);
    });

    await appRequest
      .get(`${apiPrefix}/batches`)
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('count');
        const batches = res.body.results;
        const batchNames = batches.map((batch) => batch.originalName);
        expect(batchNames).toContain(batch.originalName);

        if (batches.length > 1) {
          expect(batches[0]).toHaveProperty('keywordCount');
          expect(batches[0]).toHaveProperty('processedCount');
        }
      });
  });

  it('Authenticated user should be able to get a list of keywords', async () => {
    await appRequest.get(`${apiPrefix}/keywords`).expect((res) => {
      expect(res.status).toBe(401);
    });

    await appRequest
      .get(`${apiPrefix}/keywords`)
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('count');
        expect(res.body.count).toBe(testKeywords.length);
        const keywords = res.body.results;

        keywords.forEach((e) => {
          const exists = Boolean(testKeywords.find((tKeyword) => tKeyword.name === e.name));
          expect(exists).toBe(true);
        });

        if (keywords.length > 1) {
          expect(keywords[0]).toHaveProperty('totalLinks');
          expect(keywords[0]).toHaveProperty('totalAds');
          expect(keywords[0]).toHaveProperty('totalResults');
          expect(keywords[0]).toHaveProperty('searchTime');
        }
      });
  });

  it('Query params should work', async () => {
    const queryParam = new KeywordQueryDto();
    queryParam.keyword = 'ISOPLEX';
    queryParam.size = 1;

    await appRequest
      .get(`${apiPrefix}/keywords`)
      .query({ keyword: queryParam.keyword })
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        const keywords = res.body.results;
        expect(keywords.length).toBe(testKeywords.filter((e) => e.name.includes(queryParam.keyword)).length);
      });
    await appRequest
      .get(`${apiPrefix}/keywords`)
      .query({ size: queryParam.size })
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        const keywords = res.body.results;
        expect(keywords.length).toBe(queryParam.size);
        expect(res.body.count).toBe(testKeywords.length);
      })
  });

  afterAll(async () => {
    await app.close();
  });
});
