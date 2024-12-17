import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitEntity1731381868161 implements MigrationInterface {
  name = 'InitEntity1731381868161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "companies" ("id" SERIAL NOT NULL, "company_code" character varying NOT NULL, "company_name" character varying NOT NULL, "company_address" character varying NOT NULL, "postal_code" character varying, "profile_code" character varying, "company_email" character varying NOT NULL, "website" character varying NOT NULL, "registration_number" character varying NOT NULL, "company_type" character varying NOT NULL, "description" character varying NOT NULL, "representative_name" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "location" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "logoId" uuid, CONSTRAINT "REL_652da5b265918d45aaba9d3a3a" UNIQUE ("logoId"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c59133f1df5217119eedb39754" ON "companies" ("company_code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "first_name" character varying, "last_name" character varying, "email" character varying, "password" character varying, "auth_provider" character varying NOT NULL DEFAULT 'email', "social_id" character varying, "user_code" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "file_id" uuid, "userRoleId" integer, "user_status" integer, "userCodeId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_23351656ab098559729ac15f50a" UNIQUE ("user_code"), CONSTRAINT "REL_a367444399d0404c15d7dffdb0" UNIQUE ("file_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef2fb839248017665e5033e730" ON "users" ("first_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_24ed31edd4e42499a687467fdc" ON "users" ("social_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "userId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."carbon_projects_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'PENDING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "carbon_projects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "status" "public"."carbon_projects_status_enum" NOT NULL DEFAULT 'PENDING', "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d9ab2cb61a83e373b87eaffa1e9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0dd114af38ff758aa0139ebe52" ON "carbon_projects" ("code") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."carbon_credits_status_enum" AS ENUM('AVAILABLE', 'SOLD', 'RETIRED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "carbon_credits" ("id" BIGSERIAL NOT NULL, "serial_number" character varying NOT NULL, "certification_standard" character varying NOT NULL, "issued_at" TIMESTAMP NOT NULL, "expiration_at" TIMESTAMP NOT NULL, "price" integer NOT NULL, "status" "public"."carbon_credits_status_enum" NOT NULL DEFAULT 'AVAILABLE', "credit_amount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "company_code" character varying, "project_code" character varying, CONSTRAINT "PK_372355f67293439de19812b7668" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" SERIAL NOT NULL, "enable_at" boolean, "enable_edit" boolean, "enable_delete" boolean, "enable_view" boolean, "user_id" integer, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" ADD CONSTRAINT "FK_652da5b265918d45aaba9d3a3a1" FOREIGN KEY ("logoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a367444399d0404c15d7dffdb02" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a52455e2cef06f0a3faf30f96a3" FOREIGN KEY ("userRoleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_9f33d7add358ad66647aeb1e074" FOREIGN KEY ("user_status") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_36563bd1e320c889f60e9eee656" FOREIGN KEY ("userCodeId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carbon_credits" ADD CONSTRAINT "FK_6b8b3cb7154cb064e514612e993" FOREIGN KEY ("company_code") REFERENCES "companies"("company_code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carbon_credits" ADD CONSTRAINT "FK_8fccb053f6cac0dbfcfc8a1b1ac" FOREIGN KEY ("project_code") REFERENCES "carbon_projects"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_8ec1323d871577a8795e54c9c4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_8ec1323d871577a8795e54c9c4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carbon_credits" DROP CONSTRAINT "FK_8fccb053f6cac0dbfcfc8a1b1ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carbon_credits" DROP CONSTRAINT "FK_6b8b3cb7154cb064e514612e993"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_36563bd1e320c889f60e9eee656"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_9f33d7add358ad66647aeb1e074"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a52455e2cef06f0a3faf30f96a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a367444399d0404c15d7dffdb02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" DROP CONSTRAINT "FK_652da5b265918d45aaba9d3a3a1"`,
    );
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TABLE "carbon_credits"`);
    await queryRunner.query(`DROP TYPE "public"."carbon_credits_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0dd114af38ff758aa0139ebe52"`,
    );
    await queryRunner.query(`DROP TABLE "carbon_projects"`);
    await queryRunner.query(`DROP TYPE "public"."carbon_projects_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_24ed31edd4e42499a687467fdc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ef2fb839248017665e5033e730"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c59133f1df5217119eedb39754"`,
    );
    await queryRunner.query(`DROP TABLE "companies"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
