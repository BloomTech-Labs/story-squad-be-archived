import { MigrationInterface, QueryRunner } from 'typeorm';
import { Cohort, Canon, Parent, Child, Stories, Illustrations } from '../../../database/entity';
import { CohortSeed, CanonSeed, ParentSeed, ChildSeed, StorySeed, IllustrationSeed } from './seeds';
import Stripe from 'stripe';

export class MainMigration1589820698846 implements MigrationInterface {
    name = 'MainMigration1589820698846';

    public async up(queryRunner: QueryRunner): Promise<any> {
        /* Basic query structure copied from generating a new migration (migration:generate) */
        await queryRunner.query(
            `CREATE TABLE "admin" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "temptoken" character varying, "role" character varying NOT NULL, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "canon" ("week" integer NOT NULL, "base64" character varying NOT NULL, "altbase64" character varying, CONSTRAINT "PK_8c1bfa026b3b545879ae7437a05" PRIMARY KEY ("week"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "parent" ("id" SERIAL NOT NULL, "name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "stripeID" character varying, CONSTRAINT "UQ_9158391af7b8ca4911efaad8a73" UNIQUE ("email"), CONSTRAINT "PK_bf93c41ee1ae1649869ebd05617" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "matches" ("id" SERIAL NOT NULL, "team1_child1_id" integer, "team1_child2_id" integer, "team2_child1_id" integer, "team2_child2_id" integer, "week" integer, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "versus" ("id" SERIAL NOT NULL, "votes" integer NOT NULL, "story" boolean NOT NULL, "cohortId" integer, "matchId" integer, CONSTRAINT "PK_41d9cf225dd9b71306bf7b2984a" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "cohort" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "week" integer NOT NULL, "activity" character varying NOT NULL, "dueDatesReading" TIMESTAMP NOT NULL, "dueDatesWriting" TIMESTAMP NOT NULL, "dueDatesDrawing" TIMESTAMP NOT NULL, "dueDatesTeamreview" TIMESTAMP, "dueDatesRandomreview" TIMESTAMP, "dueDatesResults" TIMESTAMP, CONSTRAINT "PK_4fb3cca38dc4b461110344e5f9b" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "stories" ("id" SERIAL NOT NULL, "childId" integer NOT NULL, "week" integer NOT NULL, "storyText" character varying, "points" integer, "votes" integer, "flesch_reading_ease" double precision, "smog_index" double precision, "flesch_kincaid_grade" double precision, "coleman_liau_index" double precision, "automated_readability_index" double precision, "dale_chall_readability_score" double precision, "difficult_words" double precision, "linsear_write_formula" double precision, "gunning_fog" double precision, "consolidated_score" character varying, "doc_length" integer, "quote_count" integer, "storyPage1" character varying, "storyPage2" character varying, "storyPage3" character varying, "storyPage4" character varying, "storyPage5" character varying, "transcribedTextT_page1" character varying, "transcribedTextT_page2" character varying, "transcribedTextT_page3" character varying, "transcribedTextT_page4" character varying, "transcribedTextT_page5" character varying, CONSTRAINT "PK_bb6f880b260ed96c452b32a39f0" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "emojis" ("id" SERIAL NOT NULL, "emoji" character varying NOT NULL, "storyId" integer, "illustrationId" integer, CONSTRAINT "PK_9adb96a675f555c6169bad7ba62" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "illustrations" ("id" SERIAL NOT NULL, "childId" integer NOT NULL, "week" integer NOT NULL, "illustration" character varying, "points" integer, "votes" integer, CONSTRAINT "PK_ec4a601172b41459d76aeb1f02f" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "child" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "grade" integer NOT NULL, "subscription" boolean NOT NULL DEFAULT false, "avatar" character varying, "total_points" integer, "wins" integer, "losses" integer, "votes" integer, "parentId" integer, "cohortId" integer, "preferencesDyslexia" boolean NOT NULL DEFAULT false, "progressReading" boolean NOT NULL DEFAULT false, "progressWriting" boolean NOT NULL DEFAULT false, "progressDrawing" boolean NOT NULL DEFAULT false, "progressTeamreview" boolean NOT NULL DEFAULT false, "progressRandomreview" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_4609b9b323ca37c6bc435ec4b6b" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "versus_children_child" ("versusId" integer NOT NULL, "childId" integer NOT NULL, CONSTRAINT "PK_79c4574732850645b3f67932d97" PRIMARY KEY ("versusId", "childId"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_e43bc821fbc577e7d9754696cf" ON "versus_children_child" ("versusId") `,
            undefined
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_e0cd577bce7cbca0562dd892cf" ON "versus_children_child" ("childId") `,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "versus" ADD CONSTRAINT "FK_0ebb3db00101398ef2c6fcf40b5" FOREIGN KEY ("cohortId") REFERENCES "cohort"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "versus" ADD CONSTRAINT "FK_688af0f0bb08e7a78ac2b104850" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "stories" ADD CONSTRAINT "FK_71d050c35abe5d607bb746503af" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "emojis" ADD CONSTRAINT "FK_17b9553027357d60b072e1e263a" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "emojis" ADD CONSTRAINT "FK_366600382fe9155d09353e88232" FOREIGN KEY ("illustrationId") REFERENCES "illustrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "illustrations" ADD CONSTRAINT "FK_2675728b1c00556cd980c77b849" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "child" ADD CONSTRAINT "FK_8a2f35051e01ce9c6656af13c7c" FOREIGN KEY ("parentId") REFERENCES "parent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "child" ADD CONSTRAINT "FK_faecc77a0cf169a4c97f0a8d812" FOREIGN KEY ("cohortId") REFERENCES "cohort"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "versus_children_child" ADD CONSTRAINT "FK_e43bc821fbc577e7d9754696cfc" FOREIGN KEY ("versusId") REFERENCES "versus"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "versus_children_child" ADD CONSTRAINT "FK_e0cd577bce7cbca0562dd892cf4" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );

        /* SEEDING - Need to use queryRunner's Manager to get the proper connection info */
        await queryRunner.manager.getRepository(Cohort).save(CohortSeed);
        await queryRunner.manager.getRepository(Canon).save(CanonSeed);
        //Should match auth exactly
        let { id: stripeID } = await new Stripe(process.env.STRIPE_API, {
            apiVersion: '2019-12-03',
            typescript: true,
        }).customers.create({
            email: ParentSeed.email,
        });
        ParentSeed.stripeID = stripeID;
        await queryRunner.manager.getRepository(Parent).save(ParentSeed);
        await queryRunner.manager.getRepository(Child).save(ChildSeed);
        await queryRunner.manager.getRepository(Stories).save(StorySeed);
        await queryRunner.manager.getRepository(Illustrations).save(IllustrationSeed);
        /******************/
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "versus_children_child" DROP CONSTRAINT "FK_e0cd577bce7cbca0562dd892cf4"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "versus_children_child" DROP CONSTRAINT "FK_e43bc821fbc577e7d9754696cfc"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "child" DROP CONSTRAINT "FK_faecc77a0cf169a4c97f0a8d812"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "child" DROP CONSTRAINT "FK_8a2f35051e01ce9c6656af13c7c"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "illustrations" DROP CONSTRAINT "FK_2675728b1c00556cd980c77b849"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "emojis" DROP CONSTRAINT "FK_366600382fe9155d09353e88232"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "emojis" DROP CONSTRAINT "FK_17b9553027357d60b072e1e263a"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "stories" DROP CONSTRAINT "FK_71d050c35abe5d607bb746503af"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "versus" DROP CONSTRAINT "FK_688af0f0bb08e7a78ac2b104850"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "versus" DROP CONSTRAINT "FK_0ebb3db00101398ef2c6fcf40b5"`,
            undefined
        );
        await queryRunner.query(`DROP INDEX "IDX_e0cd577bce7cbca0562dd892cf"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_e43bc821fbc577e7d9754696cf"`, undefined);
        await queryRunner.query(`DROP TABLE "versus_children_child"`, undefined);
        await queryRunner.query(`DROP TABLE "child"`, undefined);
        await queryRunner.query(`DROP TABLE "illustrations"`, undefined);
        await queryRunner.query(`DROP TABLE "emojis"`, undefined);
        await queryRunner.query(`DROP TABLE "stories"`, undefined);
        await queryRunner.query(`DROP TABLE "cohort"`, undefined);
        await queryRunner.query(`DROP TABLE "versus"`, undefined);
        await queryRunner.query(`DROP TABLE "matches"`, undefined);
        await queryRunner.query(`DROP TABLE "parent"`, undefined);
        await queryRunner.query(`DROP TABLE "canon"`, undefined);
        await queryRunner.query(`DROP TABLE "admin"`, undefined);
    }
}
