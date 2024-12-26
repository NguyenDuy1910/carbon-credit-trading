import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityNew1734578443945 implements MigrationInterface {
    name = 'UpdateEntityNew1734578443945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP CONSTRAINT "FK_fbfcd176a3ba983cd22a61c307e"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ALTER COLUMN "project_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD CONSTRAINT "FK_fbfcd176a3ba983cd22a61c307e" FOREIGN KEY ("project_id") REFERENCES "carbon_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_credits" DROP CONSTRAINT "FK_fbfcd176a3ba983cd22a61c307e"`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ALTER COLUMN "project_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_credits" ADD CONSTRAINT "FK_fbfcd176a3ba983cd22a61c307e" FOREIGN KEY ("project_id") REFERENCES "carbon_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
