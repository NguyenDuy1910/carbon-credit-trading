import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCompanyKYC1734058716789 implements MigrationInterface {
  name = 'UpdateCompanyKYC1734058716789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company_kyc" ("id" SERIAL NOT NULL, "documents" character varying NOT NULL, "file" character varying NOT NULL, "check_day" TIMESTAMP NOT NULL, "notes" character varying NOT NULL, "status" integer NOT NULL, "verified_by" character varying NOT NULL, "verified_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer, CONSTRAINT "REL_fdd9ed60f3f37e828c448cc83e" UNIQUE ("company_id"), CONSTRAINT "PK_184773e9af9030478a57b8db410" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_kyc" ADD CONSTRAINT "FK_fdd9ed60f3f37e828c448cc83e5" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_kyc" DROP CONSTRAINT "FK_fdd9ed60f3f37e828c448cc83e5"`,
    );
    await queryRunner.query(`DROP TABLE "company_kyc"`);
  }
}
