import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class AddRewardDto {
  @IsOptional()
  @IsNumber()
  rewardPoint: number;

  @IsOptional()
  @IsNumber()
  rewardValue: number;

  @IsOptional()
  @IsNumber()
  rewardWithdrawAmount: number;
  
  @IsOptional()
  @IsNumber()
  rewardWithdrawPurchaseAmount: number;
}

export class FilterRewardDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  visibility: boolean;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  price: number;
}

export class OptionRewardDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateRewardDto {
  @IsOptional()
  @IsNumber()
  rewardPoint: number;

  @IsOptional()
  @IsNumber()
  rewardValue: number;

  @IsOptional()
  @IsNumber()
  rewardWithdrawAmount: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class FilterAndPaginationRewardDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterRewardDto)
  filter: FilterRewardDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  sort: object;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  select: any;
}
