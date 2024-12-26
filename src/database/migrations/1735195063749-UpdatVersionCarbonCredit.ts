import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatVersionCarbonCredit1735195063749 implements MigrationInterface {
    name = 'UpdatVersionCarbonCredit1735195063749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "version" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "version"`);
    }

}
