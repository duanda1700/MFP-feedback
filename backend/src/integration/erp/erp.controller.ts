import { Controller, Post, Get } from '@nestjs/common';
import { ErpService } from './erp.service';

@Controller('api/integration/erp')
export class ErpController {
  constructor(private readonly erpService: ErpService) {}

  @Post('sync')
  async syncErpData() {
    return this.erpService.syncErpData();
  }

  @Post('manual-sync')
  async manuallySyncErpData() {
    return this.erpService.manuallySyncErpData();
  }
}
