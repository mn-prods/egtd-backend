import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInboxItems1688675191429 implements MigrationInterface {
    name = 'AddInboxItems1688675191429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inbox" ("id" varchar2(36), "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "modified" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "status" varchar2(255) DEFAULT 'OPEN' NOT NULL, "owner_uid" varchar2(255), CONSTRAINT "PK_ab7abc299fab4bb4f965549c819" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inbox" ADD CONSTRAINT "FK_4f135fd49466d2cf460acacdcc8" FOREIGN KEY ("owner_uid") REFERENCES "users" ("uid")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inbox" DROP CONSTRAINT "FK_4f135fd49466d2cf460acacdcc8"`);
        await queryRunner.query(`DROP TABLE "inbox"`);
    }

}
