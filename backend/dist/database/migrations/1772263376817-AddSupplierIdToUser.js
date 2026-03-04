"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSupplierIdToUser1772263376817 = void 0;
class AddSupplierIdToUser1772263376817 {
    name = 'AddSupplierIdToUser1772263376817';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`supplier_id\` int NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`supplier_id\``);
    }
}
exports.AddSupplierIdToUser1772263376817 = AddSupplierIdToUser1772263376817;
//# sourceMappingURL=1772263376817-AddSupplierIdToUser.js.map