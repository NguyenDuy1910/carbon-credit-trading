import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityNew1734575344205 implements MigrationInterface {
    name = 'UpdateEntityNew1734575344205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP CONSTRAINT "FK_6b8b3cb7154cb064e514612e993"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP CONSTRAINT "FK_8fccb053f6cac0dbfcfc8a1b1ac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0dd114af38ff758aa0139ebe52"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."carbon_projects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "serial_number"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "certification_standard"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "issued_at"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "expiration_at"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."carbon_credits_status_enum"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "credit_amount"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "company_code"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "project_code"`);
        await queryRunner.query(`CREATE TYPE "public"."carbon_projects_type_enum" AS ENUM('compensation', 'renewable', 'forestry', 'energy', 'other')`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "type" "public"."carbon_projects_type_enum" NOT NULL DEFAULT 'renewable'`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "isActive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "isVintage" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "totalStock" double precision`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "co2Balance" double precision`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "cover" character varying`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "isFreeDonation" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "currencyToken" integer`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "price" double precision`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "countryName" character varying`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "countryFlag" character varying`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "project_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "year" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "stock" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "token_asa_id" integer`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "available_volume_credits" double precision`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "have_available_credits" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP CONSTRAINT "PK_372355f67293439de19812b7668"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD CONSTRAINT "PK_372355f67293439de19812b7668" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "price" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD CONSTRAINT "FK_fbfcd176a3ba983cd22a61c307e" FOREIGN KEY ("project_id") REFERENCES "carbon_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP CONSTRAINT "FK_fbfcd176a3ba983cd22a61c307e"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP CONSTRAINT "PK_372355f67293439de19812b7668"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD CONSTRAINT "PK_372355f67293439de19812b7668" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "have_available_credits"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "available_volume_credits"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "token_asa_id"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "stock"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "countryFlag"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "countryName"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "currencyToken"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "isFreeDonation"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "cover"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "co2Balance"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "totalStock"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "isVintage"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."carbon_projects_type_enum"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "project_code" character varying`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "company_code" character varying`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "credit_amount" integer NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."carbon_credits_status_enum" AS ENUM('AVAILABLE', 'SOLD', 'RETIRED')`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "status" "public"."carbon_credits_status_enum" NOT NULL DEFAULT 'AVAILABLE'`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "expiration_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "issued_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "certification_standard" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD "serial_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "end_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "start_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."carbon_projects_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'PENDING')`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "status" "public"."carbon_projects_status_enum" NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "carbon_projects" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0dd114af38ff758aa0139ebe52" ON "carbon_projects" ("code") `);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD CONSTRAINT "FK_8fccb053f6cac0dbfcfc8a1b1ac" FOREIGN KEY ("project_code") REFERENCES "carbon_projects"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD CONSTRAINT "FK_6b8b3cb7154cb064e514612e993" FOREIGN KEY ("company_code") REFERENCES "companies"("company_code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
