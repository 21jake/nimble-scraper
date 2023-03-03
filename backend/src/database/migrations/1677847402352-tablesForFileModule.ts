import { MigrationInterface, QueryRunner } from "typeorm";

export class tablesForFileModule1677847402352 implements MigrationInterface {
    name = 'tablesForFileModule1677847402352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "keywords" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "cachePath" character varying(255) NOT NULL, "success" boolean, "proxy" character varying(100), "error" character varying(255), "totalLinks" bigint, "totalAds" bigint, "totalResults" bigint, "searchTime" character varying(10), "createdDate" TIMESTAMP DEFAULT now(), "batchId" integer NOT NULL, CONSTRAINT "PK_4aa660a7a585ed828da68f3c28e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "batches" ("id" SERIAL NOT NULL, "originalName" character varying(255) NOT NULL, "cachePath" character varying(100) NOT NULL, "createdDate" TIMESTAMP DEFAULT now(), "uploaderId" integer NOT NULL, CONSTRAINT "PK_55e7ff646e969b61d37eea5be7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "keywords" ADD CONSTRAINT "FK_a2373560123aa5388384a4892e2" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "batches" ADD CONSTRAINT "FK_cad2d79bbd7ee16a4ab7b1272f1" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batches" DROP CONSTRAINT "FK_cad2d79bbd7ee16a4ab7b1272f1"`);
        await queryRunner.query(`ALTER TABLE "keywords" DROP CONSTRAINT "FK_a2373560123aa5388384a4892e2"`);
        await queryRunner.query(`DROP TABLE "batches"`);
        await queryRunner.query(`DROP TABLE "keywords"`);
    }

}
