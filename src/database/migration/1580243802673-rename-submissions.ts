import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameSubmissions1580243802673 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameTable('submissions', 'submission');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameTable('submission', 'submissions');
    }
}
