import {MigrationInterface, QueryRunner} from "typeorm";

export class ss1583786660665 implements MigrationInterface {
    name = 'ss1583786660665'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "temptoken" character varying, "role" character varying NOT NULL, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "canon" ("week" integer NOT NULL, "base64" character varying NOT NULL, "altbase64" character varying, CONSTRAINT "PK_8c1bfa026b3b545879ae7437a05" PRIMARY KEY ("week"))`, undefined);
        await queryRunner.query(`CREATE TABLE "parent" ("id" SERIAL NOT NULL, "name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "stripeID" character varying, CONSTRAINT "UQ_9158391af7b8ca4911efaad8a73" UNIQUE ("email"), CONSTRAINT "PK_bf93c41ee1ae1649869ebd05617" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "cohort" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "week" integer NOT NULL, "activity" character varying NOT NULL, "dueDatesReading" TIMESTAMP NOT NULL, "dueDatesWriting" TIMESTAMP NOT NULL, "dueDatesSubmission" TIMESTAMP NOT NULL, CONSTRAINT "PK_4fb3cca38dc4b461110344e5f9b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "submissions" ("id" SERIAL NOT NULL, "week" integer NOT NULL, "storyText" character varying, "illustration" character varying, "flesch_reading_ease" character varying NOT NULL, "smog_index" character varying NOT NULL, "flesch_kincaid_grade" character varying NOT NULL, "coleman_liau_index" character varying NOT NULL, "automated_readability_index" character varying NOT NULL, "dale_chall_readability_score" character varying NOT NULL, "difficult_words" character varying NOT NULL, "linsear_write_formula" character varying NOT NULL, "gunning_fog" character varying NOT NULL, "consolidated_score" character varying NOT NULL, "doc_length" character varying NOT NULL, "quote_count" character varying NOT NULL, "transcribed_text" character varying NOT NULL, "childId" integer, "storyPage1" character varying, "storyPage2" character varying, "storyPage3" character varying, "storyPage4" character varying, "storyPage5" character varying, CONSTRAINT "PK_10b3be95b8b2fb1e482e07d706b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "child" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "grade" integer NOT NULL, "subscription" boolean NOT NULL DEFAULT false, "parentId" integer, "cohortId" integer, "preferencesDyslexia" boolean NOT NULL DEFAULT false, "progressReading" boolean NOT NULL DEFAULT false, "progressWriting" boolean NOT NULL DEFAULT false, "progressSubmission" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_4609b9b323ca37c6bc435ec4b6b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "matches" ("id" SERIAL NOT NULL, "team1_child1_id" integer NOT NULL, "team1_child2_id" integer NOT NULL, "team2_child1_id" integer NOT NULL, "team2_child2_id" integer NOT NULL, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "FK_78fc17f7e4475f45843db326fd5" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD CONSTRAINT "FK_8a2f35051e01ce9c6656af13c7c" FOREIGN KEY ("parentId") REFERENCES "parent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD CONSTRAINT "FK_faecc77a0cf169a4c97f0a8d812" FOREIGN KEY ("cohortId") REFERENCES "cohort"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "child" DROP CONSTRAINT "FK_faecc77a0cf169a4c97f0a8d812"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP CONSTRAINT "FK_8a2f35051e01ce9c6656af13c7c"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_78fc17f7e4475f45843db326fd5"`, undefined);
        await queryRunner.query(`DROP TABLE "matches"`, undefined);
        await queryRunner.query(`DROP TABLE "child"`, undefined);
        await queryRunner.query(`DROP TABLE "submissions"`, undefined);
        await queryRunner.query(`DROP TABLE "cohort"`, undefined);
        await queryRunner.query(`DROP TABLE "parent"`, undefined);
        await queryRunner.query(`DROP TABLE "canon"`, undefined);
        await queryRunner.query(`DROP TABLE "admin"`, undefined);
    }

}
