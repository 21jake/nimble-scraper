import { Like, MigrationInterface, QueryRunner } from 'typeorm';
import { appEnv } from '../../configs/config';
import { Batch } from '../../entities/batch.entity';
import { Keyword } from '../../entities/keyword.entity';
import { User } from '../../entities/user.entity';
import { batch, keywords, testKeywordPref, user } from '../unit-test.data';

export class createUnitTestRecords1678075998716 implements MigrationInterface {
  // This migration is only for testing purposes and only runs in the local database

  public async up(qr: QueryRunner): Promise<void> {
    if (appEnv.DATABASE_NAME !== 'local') return;

    const conn = qr.connection;
    const userRepo = conn.getRepository(User);
    const keywordRepo = conn.getRepository(Keyword);
    const batchRepo = conn.getRepository(Batch);

    const testUser = await userRepo.save(user);
    const testBatch = new Batch();
    testBatch.originalName = batch.originalName;
    testBatch.fileName = batch.fileName;
    testBatch.uploader = testUser;
    await batchRepo.save(testBatch);

    const insertKwPromises = keywords.map((kw) => {
      const keyword = new Keyword();
      keyword.name = kw.name;
      keyword.fileName = kw.fileName;
      keyword.success = kw.success;
      keyword.proxy = kw.proxy;
      keyword.error = kw.error;
      keyword.totalLinks = Number(kw.totalLinks);
      keyword.totalAds = Number(kw.totalAds);
      keyword.totalResults = Number(kw.totalResults);
      keyword.searchTime = kw.searchTime;
      keyword.batch = testBatch;
      return keywordRepo.save(keyword);
    });

    const kws = await Promise.all(insertKwPromises);

    console.log({ testBatch, testUser, kws });
  }

  public async down(qr: QueryRunner): Promise<void> {
    if (appEnv.DATABASE_NAME !== 'local') return;

    const conn = qr.connection;
    const userRepo = conn.getRepository(User);
    const keywordRepo = conn.getRepository(Keyword);
    const batchRepo = conn.getRepository(Batch);

    await userRepo.delete({ username: user.username });
    await batchRepo.delete({ originalName: batch.originalName });

    // delete where name Like 'testKeywordPref%'
    await keywordRepo.delete({ name: Like(testKeywordPref) });
  }
}
