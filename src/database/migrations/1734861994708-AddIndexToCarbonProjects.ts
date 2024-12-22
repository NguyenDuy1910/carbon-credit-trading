import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToCarbonProjects1734861994708 implements MigrationInterface {
    name = 'AddIndexToCarbonProjects1734861994708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "documents" ("id" SERIAL NOT NULL, "path" character varying NOT NULL, "file_type" character varying NOT NULL, "mime_type" character varying, "size" double precision, "original_name" character varying, "document_type" character varying, "description" character varying, "uploaded_by" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "file" uuid, "carbon_project_id" integer NOT NULL, CONSTRAINT "REL_aab800c16bb55962434973a42f" UNIQUE ("file"), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d9ab2cb61a83e373b87eaffa1e" ON "carbon_projects" ("id") `);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_aab800c16bb55962434973a42f2" FOREIGN KEY ("file") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_e522a280fd225dde09e7f8072fa" FOREIGN KEY ("carbon_project_id") REFERENCES "carbon_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_e522a280fd225dde09e7f8072fa"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_aab800c16bb55962434973a42f2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9ab2cb61a83e373b87eaffa1e"`);
        await queryRunner.query(`DROP TABLE "documents"`);
    }

}
