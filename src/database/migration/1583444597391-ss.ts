import {MigrationInterface, QueryRunner} from "typeorm";

export class ss1583444597391 implements MigrationInterface {
    name = 'ss1583444597391'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "story" ("id" SERIAL NOT NULL, "base64" character varying NOT NULL, "altbase64" character varying, "title" character varying, CONSTRAINT "PK_28fce6873d61e2cace70a0f3361" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" SERIAL NOT NULL, "feedback" character varying NOT NULL, "childId" integer, "submissionId" integer, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "readability" ("id" SERIAL NOT NULL, "flesch_reading_ease" character varying NOT NULL, "smog_index" character varying NOT NULL, "flesch_kincaid_grade" character varying NOT NULL, "coleman_liau_index" character varying NOT NULL, "automated_readability_index" character varying NOT NULL, "dale_chall_readability_score" character varying NOT NULL, "difficult_words" character varying NOT NULL, "linsear_write_formula" character varying NOT NULL, "gunning_fog" character varying NOT NULL, "consolidated_score" character varying NOT NULL, "doc_length" character varying NOT NULL, "quote_count" character varying NOT NULL, "transcribed_text" character varying NOT NULL, CONSTRAINT "PK_16177a0ba9332dcde90b6f67ad9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "submission" ("id" SERIAL NOT NULL, "cohort_chapters_id" integer NOT NULL, "image" character varying NOT NULL, "allocated_points" integer NOT NULL, "final_points" integer NOT NULL, "high_bracket" boolean NOT NULL, "low_bracket" boolean NOT NULL, "win" boolean NOT NULL, "date" TIMESTAMP NOT NULL, "votes" integer NOT NULL, "type" character varying NOT NULL, "childId" integer, "roundId" integer, "roundCanonId" integer, "roundCohortId" integer, CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "matches" ("id" SERIAL NOT NULL, "team1_child1_id" integer NOT NULL, "team1_child2_id" integer NOT NULL, "team2_child1_id" integer NOT NULL, "team2_child2_id" integer NOT NULL, "roundId" integer, "roundCanonId" integer, "roundCohortId" integer, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "round" ("id" SERIAL NOT NULL, "current" boolean NOT NULL, "canonId" integer NOT NULL, "cohortId" integer NOT NULL, CONSTRAINT "PK_a83f05d60be0de1e3651b404d37" PRIMARY KEY ("id", "canonId", "cohortId"))`, undefined);
        await queryRunner.query(`CREATE TABLE "child__votes" ("id" SERIAL NOT NULL, "votes" integer NOT NULL, "childId" integer, "matchesId" integer, "roundId" integer, "roundCanonId" integer, "roundCohortId" integer, CONSTRAINT "PK_b2e96c397fa146f69f2d7519d81" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" DROP CONSTRAINT "PK_8c1bfa026b3b545879ae7437a05"`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" DROP COLUMN "week"`, undefined);
        await queryRunner.query(`ALTER TABLE "cohort" DROP COLUMN "dueDatesSubmission"`, undefined);
        await queryRunner.query(`ALTER TABLE "cohort" DROP COLUMN "dueDatesReading"`, undefined);
        await queryRunner.query(`ALTER TABLE "cohort" DROP COLUMN "dueDatesWriting"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "progressReading"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "progressWriting"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "progressSubmission"`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD "id" SERIAL NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD CONSTRAINT "PK_313acd10eaf6118cae06ab604fa" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD "title" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD "storyId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "avatar" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "pin" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "total_points" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "total_wins" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "total_games_played" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "childVotesId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD CONSTRAINT "FK_f132518cd993cf96b5d18a18a5d" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_fa4da75f8645ef24c0e6664c2ea" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_ae2f58b7d0fa9be21519af3d457" FOREIGN KEY ("submissionId") REFERENCES "submission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_98ebd6acbafd596c7e8a4fae3d0" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_cf0669c48269c4e1c8b4abb738e" FOREIGN KEY ("roundId", "roundCanonId", "roundCohortId") REFERENCES "round"("id","canonId","cohortId") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_013ad64f03fc9bf0fa0cdf840c1" FOREIGN KEY ("roundId", "roundCanonId", "roundCohortId") REFERENCES "round"("id","canonId","cohortId") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_7e3c7a4c4d57536db7c5e602688" FOREIGN KEY ("canonId") REFERENCES "canon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_19f0374dd1f29dec25cbb98e5ab" FOREIGN KEY ("cohortId") REFERENCES "cohort"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD CONSTRAINT "FK_9a1b4513bfb62591e3abc4119a9" FOREIGN KEY ("childVotesId") REFERENCES "child__votes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "child__votes" ADD CONSTRAINT "FK_83e1a697e07d8b4bcb55f16ea47" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "child__votes" ADD CONSTRAINT "FK_15beb4f156013ee76e7e7644b57" FOREIGN KEY ("matchesId") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "child__votes" ADD CONSTRAINT "FK_8dfb1ca86616c9289c03b85ce07" FOREIGN KEY ("roundId", "roundCanonId", "roundCohortId") REFERENCES "round"("id","canonId","cohortId") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "child__votes" DROP CONSTRAINT "FK_8dfb1ca86616c9289c03b85ce07"`, undefined);
        await queryRunner.query(`ALTER TABLE "child__votes" DROP CONSTRAINT "FK_15beb4f156013ee76e7e7644b57"`, undefined);
        await queryRunner.query(`ALTER TABLE "child__votes" DROP CONSTRAINT "FK_83e1a697e07d8b4bcb55f16ea47"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" DROP CONSTRAINT "FK_9a1b4513bfb62591e3abc4119a9"`, undefined);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_19f0374dd1f29dec25cbb98e5ab"`, undefined);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_7e3c7a4c4d57536db7c5e602688"`, undefined);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_013ad64f03fc9bf0fa0cdf840c1"`, undefined);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_cf0669c48269c4e1c8b4abb738e"`, undefined);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_98ebd6acbafd596c7e8a4fae3d0"`, undefined);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_ae2f58b7d0fa9be21519af3d457"`, undefined);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_fa4da75f8645ef24c0e6664c2ea"`, undefined);
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
        await queryRunner.query(`ALTER TABLE "child" ADD "progressSubmission" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "progressWriting" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "child" ADD "progressReading" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "cohort" ADD "dueDatesWriting" TIMESTAMP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cohort" ADD "dueDatesReading" TIMESTAMP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cohort" ADD "dueDatesSubmission" TIMESTAMP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD "week" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "canon" ADD CONSTRAINT "PK_8c1bfa026b3b545879ae7437a05" PRIMARY KEY ("week")`, undefined);
        await queryRunner.query(`DROP TABLE "child__votes"`, undefined);
        await queryRunner.query(`DROP TABLE "round"`, undefined);
        await queryRunner.query(`DROP TABLE "matches"`, undefined);
        await queryRunner.query(`DROP TABLE "submission"`, undefined);
        await queryRunner.query(`DROP TABLE "readability"`, undefined);
        await queryRunner.query(`DROP TABLE "feedback"`, undefined);
        await queryRunner.query(`DROP TABLE "story"`, undefined);
    }

}
