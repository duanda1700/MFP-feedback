import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddSupplierIdToPurchaseOrder1772263724192 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
