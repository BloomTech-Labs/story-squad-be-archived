import {MigrationInterface, QueryRunner} from "typeorm";

export class readabilityTyping1583797195949 implements MigrationInterface {
    name = 'readabilityTyping1583797195949'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "flesch_reading_ease"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "flesch_reading_ease" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "smog_index"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "smog_index" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "flesch_kincaid_grade"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "flesch_kincaid_grade" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "coleman_liau_index"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "coleman_liau_index" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "automated_readability_index"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "automated_readability_index" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "dale_chall_readability_score"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "dale_chall_readability_score" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "difficult_words"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "difficult_words" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "linsear_write_formula"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "linsear_write_formula" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "gunning_fog"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "gunning_fog" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "consolidated_score"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "consolidated_score" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "doc_length"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "doc_length" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "quote_count"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "quote_count" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "transcribed_text"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "transcribed_text" integer NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "transcribed_text"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "transcribed_text" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "quote_count"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "quote_count" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "doc_length"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "doc_length" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "consolidated_score"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "consolidated_score" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "gunning_fog"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "gunning_fog" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "linsear_write_formula"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "linsear_write_formula" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "difficult_words"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "difficult_words" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "dale_chall_readability_score"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "dale_chall_readability_score" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "automated_readability_index"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "automated_readability_index" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "coleman_liau_index"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "coleman_liau_index" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "flesch_kincaid_grade"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "flesch_kincaid_grade" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "smog_index"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "smog_index" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "flesch_reading_ease"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD "flesch_reading_ease" character varying NOT NULL`, undefined);
    }

}
