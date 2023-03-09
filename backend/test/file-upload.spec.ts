import { INestApplication } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import dayjs from 'dayjs';
import { createReadStream, readFileSync, unlinkSync, writeFileSync } from 'fs';
import path, { extname } from 'path';
import { appEnv } from 'src/configs/config';
import { FileController } from 'src/controllers/file.controller';
import { DatabaseModule } from 'src/database/database.module';
import { user } from 'src/database/unit-test.data';
import { Keyword } from 'src/entities/keyword.entity';
import { User } from 'src/entities/user.entity';
import { AuthModule } from 'src/modules/auth.module';
import { UserModule } from 'src/modules/user.module';
import { batchProviders } from 'src/providers/batch.providers';
import { keywordProviders } from 'src/providers/keyword.providers';
import { CronService } from 'src/services/cron.service';
import { FileService } from 'src/services/file.service';
import { ScraperService } from 'src/services/scraper.service';
import { Repositories } from 'src/utils/enums/repositories.enum';
import { generateRandomString } from 'src/utils/helpers';
import request from 'supertest';
import { Repository } from 'typeorm';
// jest.useRealTimers();
describe('File Upload', () => {
  //   let scraperService: ScraperService;
  //   let cronService: CronService;
  //   let batchRepository: Repository<Batch>;
  let fileService: FileService;
  let keywordRepository: Repository<Keyword>;
  let fileController: FileController;
  let appRequest: request.SuperTest<request.Test>;
  let app: INestApplication;

  let randomUsername: string;
  let randomPassword: string;

  let loggedUser: User;
  let token: string;
  const sampleName_1 = 'sample-1.csv';
  const samplePath_1 = `${appEnv.SAMPLES_PATH}/${sampleName_1}`;
  let savedFileName;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [DatabaseModule, EventEmitterModule.forRoot(), ScheduleModule.forRoot(), AuthModule, UserModule],
      controllers: [FileController],
      providers: [...batchProviders, ...keywordProviders, FileService, ScraperService, CronService],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
    appRequest = request(app.getHttpServer());

    fileController = modRef.get<FileController>(FileController);
    keywordRepository = modRef.get(Repositories.KEYWORD_REPOSITORY);
    fileService = modRef.get<FileService>(FileService);
  });

  beforeAll(async () => {
    randomUsername = generateRandomString(32);
    randomPassword = generateRandomString(32);
    const signupReq = await appRequest
      .post('/api/signup')
      .send({ username: randomUsername, password: randomPassword, confirmPassword: randomPassword });

    token = signupReq.body.token;

    loggedUser = { ...signupReq.body };
  });

  beforeAll(() => {
    const fileData = readFileSync(samplePath_1, 'utf8');
    savedFileName = `${dayjs().unix()}${extname(samplePath_1)}`;

    writeFileSync(path.join(appEnv.CSV_PATH, savedFileName), fileData);
  });

  it('Should be able to upload CSV file', async () => {
    const uploadResp = await uploadSampleCsv();

    const expectedKeywordCount = getKws(samplePath_1).length;

    expect(uploadResp).toHaveProperty('id');
    expect(uploadResp.originalName).toBe(sampleName_1);
    expect(uploadResp.fileName).toBe(savedFileName);
    expect(uploadResp.keywordCount).toBe(expectedKeywordCount);
  });

  it('Batch and Keywords should be saved', async () => {
    const csvFile = await returnCSVFile();
    const uploadResp = await fileService.handleFileUpload(csvFile, loggedUser);

    const expectedKeywords = getKws(samplePath_1);

    const actualKeywords = await keywordRepository.find({ where: { batch: { id: uploadResp.id } } });

    expect(actualKeywords.length).toBe(expectedKeywords.length);
    expect(actualKeywords.map((k) => k.name)).toEqual(expect.arrayContaining(expectedKeywords));
  });

  const getKws = (path) => {
    return readFileSync(path, { encoding: 'utf-8' }).toString().split('\n');
  };

  const uploadSampleCsv = async () => {
    const req = {
      user: loggedUser,
    };
    const csvFile = await returnCSVFile();
    const uploadResp = await fileController.uploadFile(req, csvFile);
    return uploadResp;
  };

  const fileToBuffer = (filename) => {
    const readStream = createReadStream(filename);
    const chunks = [];
    return new Promise((resolve, _) => {
      // Listen for data
      readStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      // File is done being read
      readStream.on('close', () => {
        // Create a buffer of the image from the stream
        resolve(Buffer.concat(chunks));
      });
    });
  };

  const returnCSVFile = async () => {
    const csvBuffer = (await fileToBuffer(`${samplePath_1}`)) as Buffer;

    const csvFile: Express.Multer.File = {
      buffer: csvBuffer,
      fieldname: 'file',
      originalname: sampleName_1,
      encoding: '7bit',
      mimetype: 'text/csv',
      size: 100,
      destination: appEnv.CSV_PATH,
      filename: savedFileName,
      stream: null,
      path: null,
    };
    return csvFile;
  };

  afterAll(async () => {
    unlinkSync(path.join(appEnv.CSV_PATH, savedFileName));
    await app.close();
  });
});
