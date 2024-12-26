import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateField1731382686331 implements MigrationInterface {
  name = 'UpdateField1731382686331';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "companies" DROP CONSTRAINT "FK_652da5b265918d45aaba9d3a3a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a52455e2cef06f0a3faf30f96a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_36563bd1e320c889f60e9eee656"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" RENAME COLUMN "logoId" TO "logo_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" RENAME COLUMN "userId" TO "user_id"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userRoleId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userCodeId"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "role_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "company_code" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_30e98e8746699fb9af235410af" ON "session" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" ADD CONSTRAINT "FK_762447c46ea5c7b1602ace3144e" FOREIGN KEY ("logo_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_d9b25a0c48c31ca9b96b92eaa70" FOREIGN KEY ("company_code") REFERENCES "companies"("company_code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_d9b25a0c48c31ca9b96b92eaa70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" DROP CONSTRAINT "FK_762447c46ea5c7b1602ace3144e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_30e98e8746699fb9af235410af"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "company_code"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "userCodeId" integer`);
    await queryRunner.query(`ALTER TABLE "users" ADD "userRoleId" integer`);
    await queryRunner.query(
      `ALTER TABLE "session" RENAME COLUMN "user_id" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" RENAME COLUMN "logo_id" TO "logoId"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_36563bd1e320c889f60e9eee656" FOREIGN KEY ("userCodeId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a52455e2cef06f0a3faf30f96a3" FOREIGN KEY ("userRoleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" ADD CONSTRAINT "FK_652da5b265918d45aaba9d3a3a1" FOREIGN KEY ("logoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
