"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const supplier_service_1 = require("./supplier.service");
const supplier_controller_1 = require("./supplier.controller");
const supplier_entity_1 = require("../database/entities/supplier.entity");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
const purchase_details_entity_1 = require("../database/entities/purchase-details.entity");
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
let SupplierModule = class SupplierModule {
};
exports.SupplierModule = SupplierModule;
exports.SupplierModule = SupplierModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([supplier_entity_1.Supplier, purchase_order_entity_1.PurchaseOrder, purchase_details_entity_1.PurchaseDetails, production_plan_entity_1.ProductionPlan]),
        ],
        providers: [supplier_service_1.SupplierService],
        controllers: [supplier_controller_1.SupplierController],
        exports: [supplier_service_1.SupplierService],
    })
], SupplierModule);
//# sourceMappingURL=supplier.module.js.map