import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUnitTestRecords1678075998716 implements MigrationInterface {
  name = 'createUnitTestRecords1678075998716';

  // This migration is only for testing purposes and only runs in the local database

  public async up(qr: QueryRunner): Promise<void> {
    console.log('This migration is no longer needed');
  }

  public async down(qr: QueryRunner): Promise<void> {
    console.log('This migration is no longer needed');
  }
}
