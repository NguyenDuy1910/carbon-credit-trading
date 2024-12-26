import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1735197248505 implements MigrationInterface {
    name = 'Init1735197248505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carbon_credits" ("id" SERIAL NOT NULL, "year" integer NOT NULL, "stock" integer NOT NULL, "price" double precision NOT NULL, "version" integer NOT NULL, "token_asa_id" integer, "available_volume_credits" double precision, "have_available_credits" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "project_id" integer, CONSTRAINT "PK_372355f67293439de19812b7668" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."carbon_projects_type_enum" AS ENUM('compensation', 'renewable', 'forestry', 'energy', 'other')`);
        await queryRunner.query(`CREATE TABLE "carbon_projects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" "public"."carbon_projects_type_enum" NOT NULL DEFAULT 'renewable', "isActive" boolean NOT NULL DEFAULT false, "isVintage" boolean NOT NULL DEFAULT false, "totalStock" double precision, "co2Balance" double precision, "cover" character varying, "isFreeDonation" boolean NOT NULL DEFAULT false, "currencyToken" integer, "price" double precision, "countryName" character varying, "countryFlag" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d9ab2cb61a83e373b87eaffa1e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" SERIAL NOT NULL, "path" character varying NOT NULL, "file_type" character varying NOT NULL, "mime_type" character varying, "size" double precision, "original_name" character varying, "document_type" character varying, "description" character varying, "uploaded_by" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "file" uuid, "carbon_project_id" integer NOT NULL, CONSTRAINT "REL_aab800c16bb55962434973a42f" UNIQUE ("file"), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "status" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" SERIAL NOT NULL, "company_code" character varying NOT NULL, "company_name" character varying NOT NULL, "company_address" character varying NOT NULL, "postal_code" character varying, "profile_code" character varying, "company_email" character varying NOT NULL, "website" character varying NOT NULL, "registration_number" character varying NOT NULL, "company_type" character varying, "description" character varying, "representative_name" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "location" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "logo_id" uuid, CONSTRAINT "REL_762447c46ea5c7b1602ace3144" UNIQUE ("logo_id"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c59133f1df5217119eedb39754" ON "companies" ("company_code") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "first_name" character varying, "last_name" character varying, "email" character varying, "password" character varying, "auth_provider" character varying NOT NULL DEFAULT 'email', "social_id" character varying, "user_code" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "file_id" uuid, "role_id" integer, "user_status" integer, "company_code" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_23351656ab098559729ac15f50a" UNIQUE ("user_code"), CONSTRAINT "REL_a367444399d0404c15d7dffdb0" UNIQUE ("file_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ef2fb839248017665e5033e730" ON "users" ("first_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_24ed31edd4e42499a687467fdc" ON "users" ("social_id") `);
        await queryRunner.query(`CREATE TABLE "session" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_30e98e8746699fb9af235410af" ON "session" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "enable_at" boolean, "enable_edit" boolean, "enable_delete" boolean, "enable_view" boolean, "user_id" integer, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('Pending', 'Completed', 'Cancelled', 'Failed')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "buyer_id" character varying NOT NULL, "seller_id" character varying NOT NULL, "quantity" double precision NOT NULL, "price_per_unit" double precision NOT NULL, "total_price" double precision NOT NULL, "currency" character varying(10) NOT NULL DEFAULT 'USD', "status" "public"."orders_status_enum" NOT NULL DEFAULT 'Pending', "payment_method" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "carbon_credit_id" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_kyc" ("id" SERIAL NOT NULL, "documents" character varying NOT NULL, "file" character varying NOT NULL, "check_day" TIMESTAMP NOT NULL, "notes" character varying NOT NULL, "status" character varying NOT NULL, "verified_by" character varying NOT NULL, "verified_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_184773e9af9030478a57b8db410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD CONSTRAINT "FK_fbfcd176a3ba983cd22a61c307e" FOREIGN KEY ("project_id") REFERENCES "carbon_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_aab800c16bb55962434973a42f2" FOREIGN KEY ("file") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_e522a280fd225dde09e7f8072fa" FOREIGN KEY ("carbon_project_id") REFERENCES "carbon_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_762447c46ea5c7b1602ace3144e" FOREIGN KEY ("logo_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a367444399d0404c15d7dffdb02" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9f33d7add358ad66647aeb1e074" FOREIGN KEY ("user_status") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_d9b25a0c48c31ca9b96b92eaa70" FOREIGN KEY ("company_code") REFERENCES "companies"("company_code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission" ADD CONSTRAINT "FK_8ec1323d871577a8795e54c9c4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_c7fd8b433ca7181a0d7fe009c49" FOREIGN KEY ("carbon_credit_id") REFERENCES "carbon_credits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_c7fd8b433ca7181a0d7fe009c49"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP CONSTRAINT "FK_8ec1323d871577a8795e54c9c4b"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d9b25a0c48c31ca9b96b92eaa70"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9f33d7add358ad66647aeb1e074"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a367444399d0404c15d7dffdb02"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_762447c46ea5c7b1602ace3144e"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_e522a280fd225dde09e7f8072fa"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_aab800c16bb55962434973a42f2"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP CONSTRAINT "FK_fbfcd176a3ba983cd22a61c307e"`);
        await queryRunner.query(`DROP TABLE "company_kyc"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_30e98e8746699fb9af235410af"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_24ed31edd4e42499a687467fdc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef2fb839248017665e5033e730"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c59133f1df5217119eedb39754"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "status"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TABLE "carbon_projects"`);
        await queryRunner.query(`DROP TYPE "public"."carbon_projects_type_enum"`);
        await queryRunner.query(`DROP TABLE "carbon_credits"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
