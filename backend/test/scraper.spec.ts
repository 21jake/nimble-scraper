import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { appEnv } from 'src/configs/config';
import { AuthController } from 'src/controllers/auth.controller';
import { FileController } from 'src/controllers/file.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Batch } from 'src/entities/batch.entity';
import { Keyword } from 'src/entities/keyword.entity';
import { batchProviders } from 'src/providers/batch.providers';
import { keywordProviders } from 'src/providers/keyword.providers';
import { userProviders } from 'src/providers/user.providers';
import { AuthService } from 'src/services/auth.service';
import { CronService } from 'src/services/cron.service';
import { FileService } from 'src/services/file.service';
import { ScraperService } from 'src/services/scraper.service';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { generateRandomString } from 'src/utils/helpers';
import { Repository } from 'typeorm';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { AuthModule } from 'src/modules/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/modules/user.module';

describe('Scraper', () => {
  let loggedUser: User;
  let token: string;
  let keywordRepository: Repository<Keyword>;
  let batchRepository: Repository<Batch>;
  let userRepository: Repository<User>;
  let fileController: FileController;
  let appRequest: request.SuperTest<request.Test>;
  let app: INestApplication;
  let scraperService: ScraperService;
  let cronService: CronService;

  let keywords: Partial<Keyword>[];
  let batch: Partial<Batch>;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [DatabaseModule, AuthModule, UserModule, EventEmitterModule.forRoot(), ScheduleModule.forRoot()],
      controllers: [AuthController, FileController],
      providers: [
        ...batchProviders,
        ...keywordProviders,
        ...userProviders,
        AuthService,
        JwtService,
        FileService,
        ScraperService,
        CronService,
      ],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();

    appRequest = request(app.getHttpServer());

    keywordRepository = modRef.get(Repositories.KEYWORD_REPOSITORY);
    batchRepository = modRef.get(Repositories.BATCH_REPOSITORY);
    userRepository = modRef.get(Repositories.USER_REPOSITORY);
    fileController = modRef.get(FileController);
    scraperService = modRef.get(ScraperService);
    cronService = modRef.get(CronService);
  });

  beforeAll(async () => {
    const randomUsername = generateRandomString(32);
    const randomPassword = generateRandomString(32);

    const signupReq = await appRequest
      .post('/api/signup')
      .send({ username: randomUsername, password: randomPassword, confirmPassword: randomPassword });

    token = signupReq.body.token;
    loggedUser = { ...signupReq.body };
    console.log({ loggedUser });
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
        name: `${generateRandomString()}-throwerror`,
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

  /**
   * This test is carried out as follows:
   * 1. Removed any scraped data from the keywords in the test batch
   * 2. Test if scraped data is truly removed
   * 3. Scrape the batch
   * 4. Test if scraped data is added to the keywords
   *
   * Note: This test wouldn't pass if you run test:coverage
   * due to a bug described here https://github.com/istanbuljs/istanbuljs/issues/499
   */

  it('Is able to scrape a list of keywords', async () => {
    const batch = await getTestBatch();

    await resetScrapedInfoTestBatch();

    await scraperService.onNewBatchCreated(batch);

    const { keywords: keywordsAfterScraping } = await getTestBatch();

    keywordsAfterScraping.forEach((e) => {
      if (e.success === true) {
        expect(e.success).toBe(true);
        expect(e.totalLinks).not.toBeNull();
        expect(e.totalAds).not.toBeNull();
        expect(e.searchTime).not.toBeNull();
        expect(e.fileName).not.toBeNull();
      } else {
        expect(e.success).toBe(false);
        expect(e.error).not.toBeNull();
      }
    });
  }, 60_000);

  it('Is able to rescrap failed keywords', async () => {
    await resetScrapedInfoTestBatch();

    const { keywords: keywordsBeforeRecraping } = await getTestBatch();

    await cronService.reScrape();

    const { keywords: keywordsAfterRecraping } = await getTestBatch();

    const successfulKwBeforeRescraping = keywordsBeforeRecraping.filter((e) => e.success);
    const successfulKwAfterRescraping = keywordsAfterRecraping.filter((e) => e.success);

    successfulKwAfterRescraping.forEach((e) => {
      if (e.success === true) {
        expect(e.success).toBe(true);
        expect(e.totalLinks).not.toBeNull();
        expect(e.totalAds).not.toBeNull();
        expect(e.searchTime).not.toBeNull();
        expect(e.fileName).not.toBeNull();
      } else {
        expect(e.success).toBe(false);
        expect(e.error).not.toBeNull();
      }
    });
  }, 60_000);

  const resetScrapedInfoTestBatch = async () => {
    const batch = await getTestBatch();
    const keywordsWithoutScrapedInfo = batch.keywords.map((e) => {
      e.success = false;
      e.error = null;
      e.totalLinks = null;
      e.totalAds = null;
      e.totalResults = null;
      e.searchTime = null;
      e.proxy = null;
      e.fileName = null;
      return e;
    });
    await keywordRepository.save(keywordsWithoutScrapedInfo);

    let batchKeywords = await keywordRepository.find({
      where: { batch: { id: batch.id } },
    });

    batchKeywords.forEach((e) => {
      expect(e.success).toBe(false);
      expect(e.error).toBeNull();
      expect(e.totalLinks).toBeNull();
      expect(e.totalAds).toBeNull();
      expect(e.totalResults).toBeNull();
      expect(e.searchTime).toBeNull();
      expect(e.proxy).toBeNull();
      expect(e.fileName).toBeNull();
    });

    return batchKeywords;
  };

  const getTestBatch = async () => {
    const output = await batchRepository.findOne({
      where: { id: batch.id },
      relations: ['keywords'],
    });
    expect(output.keywords).toHaveLength(keywords.length);
    return output;
  };

  afterAll(async () => {
    await userRepository.delete({ id: loggedUser.id });
    await app.close();
  });
});
