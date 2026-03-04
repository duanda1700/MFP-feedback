import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSupplierIdToPurchaseOrder1772263724192 implements MigrationInterface {
    name = 'AddSupplierIdToPurchaseOrder1772263724192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`PURCHASE_ORDER\` ADD \`supplier_id\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`PURCHASE_ORDER\` DROP COLUMN \`supplier_id\``);
    }

}
