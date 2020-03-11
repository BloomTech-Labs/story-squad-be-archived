import {MigrationInterface, QueryRunner} from "typeorm";

export class fixEntitiesMatches1583889060140 implements MigrationInterface {
    name = 'fixEntitiesMatches1583889060140'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "matches" ADD "week" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" ALTER COLUMN "team1_child1_id" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" ALTER COLUMN "team1_child2_id" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" ALTER COLUMN "team2_child1_id" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" ALTER COLUMN "team2_child2_id" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "matches" ALTER COLUMN "team2_child2_id" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" ALTER COLUMN "team2_child1_id" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" ALTER COLUMN "team1_child2_id" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" ALTER COLUMN "team1_child1_id" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "week"`, undefined);
    }

}
