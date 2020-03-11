import {MigrationInterface, QueryRunner} from "typeorm";

export class fixDocLengthNullable1583864713712 implements MigrationInterface {
    name = 'fixDocLengthNullable1583864713712'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "doc_length" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "submissions" ALTER COLUMN "doc_length" SET NOT NULL`, undefined);
    }

}
