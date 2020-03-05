import {MigrationInterface, QueryRunner} from "typeorm";

export class ss1583410521440 implements MigrationInterface {
    name = 'ss1583410521440'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "story" ("id" SERIAL NOT NULL, "base64" character varying NOT NULL, "altbase64" character varying, "title" character varying, CONSTRAINT "PK_28fce6873d61e2cace70a0f3361" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "story__feedback" ("id" SERIAL NOT NULL, "feedback" character varying NOT NULL, "storySubmissionId" integer, CONSTRAINT "PK_87b7b245e4e4cb782303cfabde7" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "readability" ("id" SERIAL NOT NULL, "flesch_reading_ease" character varying NOT NULL, "smog_index" character varying NOT NULL, "flesch_kincaid_grade" character varying NOT NULL, "coleman_liau_index" character varying NOT NULL, "automated_readability_index" character varying NOT NULL, "dale_chall_readability_score" character varying NOT NULL, "difficult_words" character varying NOT NULL, "linsear_write_formula" character varying NOT NULL, "gunning_fog" character varying NOT NULL, "consolidated_score" character varying NOT NULL, "doc_length" character varying NOT NULL, "quote_count" character varying NOT NULL, "transcribed_text" character varying NOT NULL, CONSTRAINT "PK_16177a0ba9332dcde90b6f67ad9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "story__submission" ("id" SERIAL NOT NULL, "cohort_chapters_id" integer NOT NULL, "image" character varying NOT NULL, "allocated_points" integer NOT NULL, "final_points" integer NOT NULL, "high_bracket" boolean NOT NULL, "low_bracket" boolean NOT NULL, "win" boolean NOT NULL, "date" TIMESTAMP NOT NULL, "votes" integer NOT NULL, "childId" integer, "cohortCanonId" integer, "cohortCanonCanonId" integer, "cohortCanonCohortId" integer, CONSTRAINT "PK_7f8e5b16e809c805c2cb20e3752" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "drawing__feedback" ("id" SERIAL NOT NULL, "feedback" character varying NOT NULL, "childId" integer, "drawingSubmissionId" integer, CONSTRAINT "PK_cb466ed8a24287a5066290838ea" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "drawing__submission" ("id" SERIAL NOT NULL, "cohort_chapters_id" integer NOT NULL, "image" character varying NOT NULL, "allocated_points" integer NOT NULL, "final_points" integer NOT NULL, "high_bracket" boolean NOT NULL, "low_bracket" boolean NOT NULL, "win" boolean NOT NULL, "date" TIMESTAMP NOT NULL, "votes" integer NOT NULL, "childIdId" integer, "childId" integer, "cohortCanonId" integer, "cohortCanonCanonId" integer, "cohortCanonCohortId" integer, CONSTRAINT "REL_7f9c30255bbfc21ecec75578ec" UNIQUE ("childIdId"), CONSTRAINT "PK_b41683d988099cefe92dc43b016" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "matches" ("id" SERIAL NOT NULL, "team1_child1_id" integer NOT NULL, "team1_child2_id" integer NOT NULL, "team2_child1_id" integer NOT NULL, "team2_child2_id" integer NOT NULL, "cohortCanonId" integer, "cohortCanonCanonId" integer, "cohortCanonCohortId" integer, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "cohort__canon" ("id" SERIAL NOT NULL, "current" boolean NOT NULL, "canonId" integer NOT NULL, "cohortId" integer NOT NULL, CONSTRAINT "PK_e6aecd108e62cbf9e8bd6ba8c99" PRIMARY KEY ("id", "canonId", "cohortId"))`, undefined);
        await queryRunner.query(`CREATE TABLE "child__votes" ("id" SERIAL NOT NULL, "votes" integer NOT NULL, "childId" integer, "matchesId" integer, "cohortCanonId" integer, "cohortCanonCanonId" integer, "cohortCanonCohortId" integer, CONSTRAINT "PK_b2e96c397fa146f69f2d7519d81" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" DROP CONSTRAINT "PK_8c1bfa026b3b545879ae7437a05"`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" DROP COLUMN "week"`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD "id" SERIAL NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD CONSTRAINT "PK_313acd10eaf6118cae06ab604fa" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD "title" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD "storyId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "avatar" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "pin" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "total_points" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "total_wins" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "total_games_played" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "childVotesId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD CONSTRAINT "FK_f132518cd993cf96b5d18a18a5d" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "story__feedback" ADD CONSTRAINT "FK_c675ac2ffeb357481f696d39c4b" FOREIGN KEY ("storySubmissionId") REFERENCES "story__submission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "story__submission" ADD CONSTRAINT "FK_a5f9975c52ed7a44fc09b773f4d" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "story__submission" ADD CONSTRAINT "FK_6bd630baa849b65e47731288088" FOREIGN KEY ("cohortCanonId", "cohortCanonCanonId", "cohortCanonCohortId") REFERENCES "cohort__canon"("id","canonId","cohortId") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "drawing__feedback" ADD CONSTRAINT "FK_38f72c0b66127dbba85488a8309" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "drawing__feedback" ADD CONSTRAINT "FK_5e9cf10dcbbb1d0d2c407c6d719" FOREIGN KEY ("drawingSubmissionId") REFERENCES "drawing__submission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "drawing__submission" ADD CONSTRAINT "FK_7f9c30255bbfc21ecec75578ec1" FOREIGN KEY ("childIdId") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "drawing__submission" ADD CONSTRAINT "FK_851677f5740eab202ce93c05081" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "drawing__submission" ADD CONSTRAINT "FK_9152ad99b90d5f4c7e1bcac3b5d" FOREIGN KEY ("cohortCanonId", "cohortCanonCanonId", "cohortCanonCohortId") REFERENCES "cohort__canon"("id","canonId","cohortId") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_47eb4028fded0e4bc44da60cddd" FOREIGN KEY ("cohortCanonId", "cohortCanonCanonId", "cohortCanonCohortId") REFERENCES "cohort__canon"("id","canonId","cohortId") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "cohort__canon" ADD CONSTRAINT "FK_3312377dd49fd2beea071f664e8" FOREIGN KEY ("canonId") REFERENCES "canon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "cohort__canon" ADD CONSTRAINT "FK_a6715a23eb934173f71be888e36" FOREIGN KEY ("cohortId") REFERENCES "cohort"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD CONSTRAINT "FK_9a1b4513bfb62591e3abc4119a9" FOREIGN KEY ("childVotesId") REFERENCES "child__votes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "child__votes" ADD CONSTRAINT "FK_83e1a697e07d8b4bcb55f16ea47" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "child__votes" ADD CONSTRAINT "FK_15beb4f156013ee76e7e7644b57" FOREIGN KEY ("matchesId") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "child__votes" ADD CONSTRAINT "FK_884f7e048274032a6a92baf8331" FOREIGN KEY ("cohortCanonId", "cohortCanonCanonId", "cohortCanonCohortId") REFERENCES "cohort__canon"("id","canonId","cohortId") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "child__votes" DROP CONSTRAINT "FK_884f7e048274032a6a92baf8331"`, undefined);
        await queryRunner.query(`ALTER TABLE "child__votes" DROP CONSTRAINT "FK_15beb4f156013ee76e7e7644b57"`, undefined);
        await queryRunner.query(`ALTER TABLE "child__votes" DROP CONSTRAINT "FK_83e1a697e07d8b4bcb55f16ea47"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP CONSTRAINT "FK_9a1b4513bfb62591e3abc4119a9"`, undefined);
        await queryRunner.query(`ALTER TABLE "cohort__canon" DROP CONSTRAINT "FK_a6715a23eb934173f71be888e36"`, undefined);
        await queryRunner.query(`ALTER TABLE "cohort__canon" DROP CONSTRAINT "FK_3312377dd49fd2beea071f664e8"`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_47eb4028fded0e4bc44da60cddd"`, undefined);
        await queryRunner.query(`ALTER TABLE "drawing__submission" DROP CONSTRAINT "FK_9152ad99b90d5f4c7e1bcac3b5d"`, undefined);
        await queryRunner.query(`ALTER TABLE "drawing__submission" DROP CONSTRAINT "FK_851677f5740eab202ce93c05081"`, undefined);
        await queryRunner.query(`ALTER TABLE "drawing__submission" DROP CONSTRAINT "FK_7f9c30255bbfc21ecec75578ec1"`, undefined);
        await queryRunner.query(`ALTER TABLE "drawing__feedback" DROP CONSTRAINT "FK_5e9cf10dcbbb1d0d2c407c6d719"`, undefined);
        await queryRunner.query(`ALTER TABLE "drawing__feedback" DROP CONSTRAINT "FK_38f72c0b66127dbba85488a8309"`, undefined);
        await queryRunner.query(`ALTER TABLE "story__submission" DROP CONSTRAINT "FK_6bd630baa849b65e47731288088"`, undefined);
        await queryRunner.query(`ALTER TABLE "story__submission" DROP CONSTRAINT "FK_a5f9975c52ed7a44fc09b773f4d"`, undefined);
        await queryRunner.query(`ALTER TABLE "story__feedback" DROP CONSTRAINT "FK_c675ac2ffeb357481f696d39c4b"`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" DROP CONSTRAINT "FK_f132518cd993cf96b5d18a18a5d"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "childVotesId"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "total_games_played"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "total_wins"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "total_points"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "pin"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "avatar"`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" DROP COLUMN "storyId"`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" DROP COLUMN "title"`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" DROP CONSTRAINT "PK_313acd10eaf6118cae06ab604fa"`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" DROP COLUMN "id"`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD "week" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD CONSTRAINT "PK_8c1bfa026b3b545879ae7437a05" PRIMARY KEY ("week")`, undefined);
        await queryRunner.query(`DROP TABLE "child__votes"`, undefined);
        await queryRunner.query(`DROP TABLE "cohort__canon"`, undefined);
        await queryRunner.query(`DROP TABLE "matches"`, undefined);
        await queryRunner.query(`DROP TABLE "drawing__submission"`, undefined);
        await queryRunner.query(`DROP TABLE "drawing__feedback"`, undefined);
        await queryRunner.query(`DROP TABLE "story__submission"`, undefined);
        await queryRunner.query(`DROP TABLE "readability"`, undefined);
        await queryRunner.query(`DROP TABLE "story__feedback"`, undefined);
        await queryRunner.query(`DROP TABLE "story"`, undefined);
    }

}
