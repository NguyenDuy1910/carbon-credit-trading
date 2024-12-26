import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToCarbonProjects1734862097274 implements MigrationInterface {
    name = 'AddIndexToCarbonProjects1734862097274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d9ab2cb61a83e373b87eaffa1e"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_d9ab2cb61a83e373b87eaffa1e" ON "carbon_projects" ("id") `);
    }

}
