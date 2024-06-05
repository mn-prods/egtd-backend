import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInboxItemLabel1688757740820 implements MigrationInterface {
    name = 'AddInboxItemLabel1688757740820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inbox" ADD "label" varchar2(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inbox" DROP COLUMN "label"`);
    }

}
