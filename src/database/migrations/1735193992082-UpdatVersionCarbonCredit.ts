import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatVersionCarbonCredit1735193992082 implements MigrationInterface {
    name = 'UpdatVersionCarbonCredit1735193992082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "version" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "version"`);
    }

}
