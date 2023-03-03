import { MigrationInterface, QueryRunner } from "typeorm";

export class createUserTable1677822904275 implements MigrationInterface {
    name = 'createUserTable1677822904275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL,
         "username" character varying(20) NOT NULL, 
         "password" character varying(255) NOT NULL, 
         "createdDate" TIMESTAMP DEFAULT now(), 
         CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), 
         CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
