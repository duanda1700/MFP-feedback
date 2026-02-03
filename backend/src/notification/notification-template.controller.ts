import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationTemplateService } from './notification-template.service';
import { RequirePermission } from '../permission/guards/permission.guard';

@Controller('api/notification/template')
@UseGuards(AuthGuard('jwt'))
export class NotificationTemplateController {
  constructor(private readonly templateService: NotificationTemplateService) {}

  @Get('list')
  @RequirePermission('notification:template:read')
  async getTemplateList(@Query() query: any) {
    return this.templateService.getTemplateList(query);
  }

  @Get('detail/:id')
  @RequirePermission('notification:template:read')
  async getTemplateDetail(@Param('id') id: number) {
    return this.templateService.getTemplateDetail(id);
  }

  @Get('default/:type')
  @RequirePermission('notification:template:read')
  async getDefaultTemplate(@Param('type') templateType: string) {
    return this.templateService.getDefaultTemplate(templateType);
  }

  @Post('create')
  @RequirePermission('notification:template:create')
  async createTemplate(@Body() body: {
    templateName: string;
    templateType: string;
    subjectTemplate: string;
    contentTemplate: string;
    linkTemplate?: string;
    isDefault?: boolean;
    createdBy: number;
    createdName: string;
  }) {
    return this.templateService.createTemplate(body);
  }

  @Post('update/:id')
  @RequirePermission('notification:template:update')
  async updateTemplate(
    @Param('id') id: number,
    @Body() body: {
      templateName?: string;
      subjectTemplate?: string;
      contentTemplate?: string;
      linkTemplate?: string;
      isDefault?: boolean;
      status?: string;
      updatedBy: number;
      updatedName: string;
    },
  ) {
    return this.templateService.updateTemplate(id, body);
  }

  @Post('delete/:id')
  @RequirePermission('notification:template:delete')
  async deleteTemplate(@Param('id') id: number) {
    return this.templateService.deleteTemplate(id);
  }

  @Post('toggle-status/:id')
  @RequirePermission('notification:template:update')
  async toggleTemplateStatus(
    @Param('id') id: number,
    @Body('status') status: string,
  ) {
    return this.templateService.toggleTemplateStatus(id, status);
  }

  @Post('render/:id')
  @RequirePermission('notification:template:read')
  async renderTemplate(
    @Param('id') id: number,
    @Body('variables') variables: Record<string, any>,
  ) {
    return this.templateService.renderTemplate(id, variables);
  }

  @Post('initialize-defaults')
  @RequirePermission('notification:template:create')
  async initializeDefaultTemplates() {
    await this.templateService.initializeDefaultTemplates();
    return { message: 'Default templates initialized successfully' };
  }
}
