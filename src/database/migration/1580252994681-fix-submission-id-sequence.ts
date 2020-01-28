import {MigrationInterface, QueryRunner} from "typeorm";

export class fixSubmissionIdSequence1580252994681 implements MigrationInterface {
    name = 'fixSubmissionIdSequence1580252994681'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE SEQUENCE "submission_id_seq" OWNED BY "submission"."id"`, undefined);
        await queryRunner.query(`ALTER TABLE "submission" ALTER COLUMN "id" SET DEFAULT nextval('submission_id_seq')`, undefined);
        await queryRunner.query(`ALTER TABLE "submission" ALTER COLUMN "id" DROP DEFAULT`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "submission" ALTER COLUMN "id" SET DEFAULT nextval('submissions_id_seq'`, undefined);
        await queryRunner.query(`ALTER TABLE "submission" ALTER COLUMN "id" DROP DEFAULT`, undefined);
        await queryRunner.query(`DROP SEQUENCE "submission_id_seq"`, undefined);
    }

}
