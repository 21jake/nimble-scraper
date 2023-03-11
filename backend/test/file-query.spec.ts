import { INestApplication } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { AuthController } from 'src/controllers/auth.controller';
import { FileController } from 'src/controllers/file.controller';
import { DatabaseModule } from 'src/database/database.module';
import { KeywordQueryDto } from 'src/dto/file-query.dto';
import { Batch } from 'src/entities/batch.entity';
import { Keyword } from 'src/entities/keyword.entity';
import { User } from 'src/entities/user.entity';
import { AuthModule } from 'src/modules/auth.module';
import { UserModule } from 'src/modules/user.module';
import { batchProviders } from 'src/providers/batch.providers';
import { keywordProviders } from 'src/providers/keyword.providers';
import { userProviders } from 'src/providers/user.providers';
import { AuthService } from 'src/services/auth.service';
import { FileService } from 'src/services/file.service';
import { StatusQuery } from 'src/utils/enums/query.enum';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { generateRandomString } from 'src/utils/helpers';
import request from 'supertest';
import { Repository } from 'typeorm';

describe('File Queries', () => {
  let loggedUser: User;
  let token: string;
  let keywordRepository: Repository<Keyword>;
  let batchRepository: Repository<Batch>;
  let userRepository: Repository<User>;
  let fileController: FileController;
  let appRequest: request.SuperTest<request.Test>;
  let app: INestApplication;

  let keywords: Partial<Keyword>[];
  let batch: Partial<Batch>;
  const apiPrefix = '/api/file';

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [DatabaseModule, AuthModule, UserModule, EventEmitterModule.forRoot(), ScheduleModule.forRoot()],
      controllers: [AuthController, FileController],
      providers: [...batchProviders, ...keywordProviders, ...userProviders, AuthService, JwtService, FileService],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();

    appRequest = request(app.getHttpServer());

    keywordRepository = modRef.get(Repositories.KEYWORD_REPOSITORY);
    batchRepository = modRef.get(Repositories.BATCH_REPOSITORY);
    userRepository = modRef.get(Repositories.USER_REPOSITORY);
    fileController = modRef.get(FileController);
  });

  beforeAll(async () => {
    const randomUsername = generateRandomString(32);
    const randomPassword = generateRandomString(32);

    const signupReq = await appRequest
      .post('/api/signup')
      .send({ username: randomUsername, password: randomPassword, confirmPassword: randomPassword });

    token = signupReq.body.token;
    loggedUser = { ...signupReq.body };
  });

  beforeAll(async () => {
    const batchName = generateRandomString();
    batch = {
      originalName: batchName,
      fileName: `${batchName}.csv`,
      uploader: loggedUser,
    };

    await batchRepository.save(batch);
    batch = await batchRepository.findOne({ where: { id: batch.id }, relations: ['keywords'] });

    keywords = [
      {
        name: generateRandomString(),
        batch: batch as any,
        fileName: null,
        success: false,
        proxy: null,
        error: null,
        totalLinks: null,
        totalAds: null,
        totalResults: null,
        searchTime: null,
        createdDate: null,
      },
      {
        name: generateRandomString(),
        batch: batch as any,
        fileName: null,
        success: null,
        proxy: null,
        error: null,
        totalLinks: null,
        totalAds: null,
        totalResults: null,
        searchTime: null,
        createdDate: null,
      },
      {
        name: generateRandomString(),
        batch: batch as any,
        fileName: null,
        success: true,
        proxy: null,
        error: null,
        totalLinks: null,
        totalAds: null,
        totalResults: null,
        searchTime: null,
        createdDate: null,
      },
      {
        name: generateRandomString(),
        batch: batch as any,
        fileName: null,
        success: true,
        proxy: null,
        error: null,
        totalLinks: null,
        totalAds: null,
        totalResults: null,
        searchTime: null,
        createdDate: null,
      },
    ];

    await keywordRepository.save(keywords);
    keywords = await keywordRepository.find({ where: { batch: { id: batch.id } } });
  });

  it('Authenticated user should be able to get a list of uploaded records', async () => {
    expect(token).toBeDefined();
    expect(loggedUser).toBeDefined();
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

        if (batches.length > 0) {
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
        expect(res.body.count).toBe(keywords.length);

        const responseKeywords = res.body.results;
        responseKeywords.forEach((e) => {
          const exists = Boolean(keywords.find((tKeyword) => tKeyword.name === e.name));
          expect(exists).toBe(true);
        });
        if (keywords.length > 0) {
          expect(keywords[0]).toHaveProperty('totalLinks');
          expect(keywords[0]).toHaveProperty('totalAds');
          expect(keywords[0]).toHaveProperty('totalResults');
          expect(keywords[0]).toHaveProperty('searchTime');
        }
      });
  });

  it('Query params should work', async () => {
    const queryParam = new KeywordQueryDto();
    queryParam.keyword = keywords[0].name;
    queryParam.size = 1;
    queryParam.batchId = String(batch.id);

    await appRequest
      .get(`${apiPrefix}/keywords`)
      .query({ keyword: queryParam.keyword.toUpperCase() })
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        const responseKeywords: Keyword[] = res.body.results;
        responseKeywords.forEach((e) => {
          expect(e.name.includes(queryParam.keyword)).toBe(true);
        });
      });
    await appRequest
      .get(`${apiPrefix}/keywords`)
      .query({ size: queryParam.size })
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        const responseKeywords: Keyword[] = res.body.results;
        expect(responseKeywords.length).toBe(queryParam.size);
        expect(res.body.count).toBe(keywords.length);
      });

    await appRequest
      .get(`${apiPrefix}/keywords`)
      .query({ status: StatusQuery.FAILED })
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        const responseKeywords: Keyword[] = res.body.results;
        responseKeywords.forEach((e) => {
          expect(e.success).toBe(false);
        });
      });
    await appRequest
      .get(`${apiPrefix}/keywords`)
      .query({ status: StatusQuery.PENDING })
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        const responseKeywords: Keyword[] = res.body.results;
        responseKeywords.forEach((e) => {
          expect(e.success).toBe(null);
        });
      });
    await appRequest
      .get(`${apiPrefix}/keywords`)
      .query({ status: StatusQuery.SUCCESS })
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        const responseKeywords: Keyword[] = res.body.results;
        responseKeywords.forEach((e) => {
          expect(e.success).toBe(true);
        });
      });

    await appRequest
      .get(`${apiPrefix}/keywords`)
      .query({ batchId: queryParam.batchId })
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        const responseKeywords: Keyword[] = res.body.results;
        responseKeywords.forEach((e) => {
          expect(e.batch.id).toBe(Number(queryParam.batchId));
        });
      });
  });

  afterAll(async () => {
    await userRepository.delete({ id: loggedUser.id });
    await app.close();
  });
});
