import { Module } from '@nestjs/common';
import { CamundaController } from './camunda.controller';
import { CamundaService } from './camunda.service';

@Module({
  controllers: [CamundaController],
  providers: [CamundaService],
  exports: [CamundaService],
})
export class CamundaModule {}
