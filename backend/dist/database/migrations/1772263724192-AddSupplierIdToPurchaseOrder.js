"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSupplierIdToPurchaseOrder1772263724192 = void 0;
class AddSupplierIdToPurchaseOrder1772263724192 {
    name = 'AddSupplierIdToPurchaseOrder1772263724192';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`PURCHASE_ORDER\` ADD \`supplier_id\` int NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`PURCHASE_ORDER\` DROP COLUMN \`supplier_id\``);
    }
}
exports.AddSupplierIdToPurchaseOrder1772263724192 = AddSupplierIdToPurchaseOrder1772263724192;
//# sourceMappingURL=1772263724192-AddSupplierIdToPurchaseOrder.js.map