import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class SplitItemDto {
  @IsString()
  @IsNotEmpty()
  materialCode: string;

  @IsString()
  @IsOptional()
  materialDesc?: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  remark?: string;
}

export class SupplierSplitDto {
  @IsNumber()
  @IsNotEmpty()
  supplierId: number;

  @IsString()
  @IsNotEmpty()
  supplierName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SplitItemDto)
  items: SplitItemDto[];
}

export class OrderSplitPreviewDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupplierSplitDto)
  suppliers: SupplierSplitDto[];
}

export class OrderSplitExecuteDto extends OrderSplitPreviewDto {
  @IsString()
  @IsOptional()
  splitReason?: string;
}

export class OrderSplitCancelDto {
  @IsNumber()
  @IsNotEmpty()
  splitRecordId: number;
}
