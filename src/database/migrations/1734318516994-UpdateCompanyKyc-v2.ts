import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCompanyKycV21734318516994 implements MigrationInterface {
  name = 'UpdateCompanyKycV21734318516994';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_kyc" DROP CONSTRAINT "FK_fdd9ed60f3f37e828c448cc83e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_kyc" DROP CONSTRAINT "REL_fdd9ed60f3f37e828c448cc83e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_kyc" DROP COLUMN "company_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_kyc" ADD "company_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_kyc" ADD CONSTRAINT "REL_fdd9ed60f3f37e828c448cc83e" UNIQUE ("company_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_kyc" ADD CONSTRAINT "FK_fdd9ed60f3f37e828c448cc83e5" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
