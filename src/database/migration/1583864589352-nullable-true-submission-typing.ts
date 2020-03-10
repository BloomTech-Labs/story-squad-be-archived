import {MigrationInterface, QueryRunner} from "typeorm";

export class nullableTrueSubmissionTyping1583864589352 implements MigrationInterface {
    name = 'nullableTrueSubmissionTyping1583864589352'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "smog_index" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "automated_readability_index" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "difficult_words" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "linsear_write_formula" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "consolidated_score" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "quote_count" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "quote_count" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "consolidated_score" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "linsear_write_formula" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "difficult_words" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "automated_readability_index" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "smog_index" SET NOT NULL`, undefined);
    }

}
