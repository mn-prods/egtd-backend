import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1688675095628 implements MigrationInterface {
    name = 'Init1688675095628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("uid" varchar2(255) NOT NULL, "email" varchar2(255), "username" varchar2(255), "avatar" varchar2(8000) NOT NULL, "gender" varchar2(1), "weight" float, "height" float, "age" number, "activity_level" number, "language_id" varchar2(36), CONSTRAINT "PK_6e20ce1edf0678a09f1963f9587" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE TABLE "languages" ("id" varchar2(36), "code" varchar2(255) NOT NULL, "i18n" varchar2(255) NOT NULL, "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "modified" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7397752718d1c9eb873722ec9b" ON "languages" ("code")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0e58ae76fbd70ddec9f0713281" ON "languages" ("i18n")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_5467acf58b481907933d4eaf046" FOREIGN KEY ("language_id") REFERENCES "languages" ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_5467acf58b481907933d4eaf046"`);
        await queryRunner.query(`DROP INDEX "IDX_0e58ae76fbd70ddec9f0713281"`);
        await queryRunner.query(`DROP INDEX "IDX_7397752718d1c9eb873722ec9b"`);
        await queryRunner.query(`DROP TABLE "languages"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
