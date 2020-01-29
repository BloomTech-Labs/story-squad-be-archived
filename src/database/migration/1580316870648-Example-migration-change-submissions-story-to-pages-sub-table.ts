import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExampleMigrationChangeSubmissionsStoryToPagesSubTable1580316870648
    implements MigrationInterface {
    name = 'ExampleMigrationChangeSubmissionsStoryToPagesSubTable1580316870648';

    public async up(queryRunner: QueryRunner): Promise<any> {
        // auto generated migration with: typeorm migration:generate

        // commented out because I do not want to delete the "story" column data
        // await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "story"`, undefined);
        // await queryRunner.query(`ALTER TABLE "submissions" ADD "storyPage1" character varying`, undefined);

        // manually added to keep "story" column data in the new "storyPage1" column
        await queryRunner.renameColumn('submissions', 'story', 'storyPage1');

        await queryRunner.query(
            `ALTER TABLE "submissions" ADD "storyPage2" character varying`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "submissions" ADD "storyPage3" character varying`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "submissions" ADD "storyPage4" character varying`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "submissions" ADD "storyPage5" character varying`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "storyPage5"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "storyPage4"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "storyPage3"`, undefined);
        await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "storyPage2"`, undefined);

        // manually added to revert renaming instead of deleting and losing data
        await queryRunner.renameColumn('submissions', 'storyPage1', 'story');

        // await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "storyPage1"`, undefined);
        // await queryRunner.query(`ALTER TABLE "submissions" ADD "story" character varying`, undefined);
    }
}
