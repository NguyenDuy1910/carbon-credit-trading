import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCompanyKYCv31734321977725 implements MigrationInterface {
    name = 'UpdateCompanyKYCv31734321977725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_kyc" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "company_kyc" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_kyc" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "company_kyc" ADD "status" integer NOT NULL`);
    }

}
