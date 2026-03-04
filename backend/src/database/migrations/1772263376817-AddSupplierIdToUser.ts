import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSupplierIdToUser1772263376817 implements MigrationInterface {
    name = 'AddSupplierIdToUser1772263376817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`supplier_id\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`supplier_id\``);
    }

}
