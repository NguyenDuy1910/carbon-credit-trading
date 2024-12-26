import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableOrder1734868461925 implements MigrationInterface {
    name = 'UpdateTableOrder1734868461925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('Pending', 'Completed', 'Cancelled', 'Failed')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "buyer_id" character varying NOT NULL, "seller_id" character varying NOT NULL, "quantity" double precision NOT NULL, "price_per_unit" double precision NOT NULL, "total_price" double precision NOT NULL, "currency" character varying(10) NOT NULL DEFAULT 'USD', "status" "public"."orders_status_enum" NOT NULL DEFAULT 'Pending', "payment_method" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "carbon_credit_id" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_c7fd8b433ca7181a0d7fe009c49" FOREIGN KEY ("carbon_credit_id") REFERENCES "carbon_credits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_c7fd8b433ca7181a0d7fe009c49"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    }

}
