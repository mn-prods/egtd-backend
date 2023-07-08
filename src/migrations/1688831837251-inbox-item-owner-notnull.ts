import { MigrationInterface, QueryRunner } from "typeorm";

export class InboxItemOwnerNotnull1688831837251 implements MigrationInterface {
    name = 'InboxItemOwnerNotnull1688831837251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inbox" DROP CONSTRAINT "FK_4f135fd49466d2cf460acacdcc8"`);
        await queryRunner.query(`ALTER TABLE "inbox" MODIFY "owner_uid" varchar2(255)  NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inbox" ADD CONSTRAINT "FK_4f135fd49466d2cf460acacdcc8" FOREIGN KEY ("owner_uid") REFERENCES "users" ("uid")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inbox" DROP CONSTRAINT "FK_4f135fd49466d2cf460acacdcc8"`);
        await queryRunner.query(`ALTER TABLE "inbox" MODIFY "owner_uid" varchar2(255)  NULL`);
        await queryRunner.query(`ALTER TABLE "inbox" ADD CONSTRAINT "FK_4f135fd49466d2cf460acacdcc8" FOREIGN KEY ("owner_uid") REFERENCES "users" ("uid")`);
    }

}
