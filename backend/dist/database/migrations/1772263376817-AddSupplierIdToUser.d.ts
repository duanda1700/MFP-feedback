import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddSupplierIdToUser1772263376817 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
