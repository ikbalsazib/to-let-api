import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class AddContactRequestDto {
  @IsOptional()
  @IsString()
  user: string;

  @IsOptional()
  @IsString()
  product: string;

  @IsOptional()
  @IsString()
  guardianName: string;

  @IsOptional()
  @IsString()
  guardianPhoneNo: string;
  

  @IsOptional()
  @IsString()
  replyDate: string;
  
}

export class FilterContactRequestDto {
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

export class FilterContactRequestGroupDto {
  @IsOptional()
  @IsBoolean()
  isGroup: boolean;

  @IsOptional()
  @IsBoolean()
  category: boolean;

  @IsOptional()
  @IsBoolean()
  subCategory: boolean;

  @IsOptional()
  @IsBoolean()
  brand: boolean;
}

export class OptionContactRequestDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateContactRequestDto {
  @IsOptional()
  product: any;



  @IsOptional()
  @IsString()
  userName: string;



  @IsOptional()
  @IsString()
  replyDate: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  review: string;

  @IsOptional()

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  reply: string;

  @IsOptional()
  status: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  ids: string[];
}

export class LikeDislikeDto {
  @IsOptional()
  @IsBoolean()
  like: boolean;

  @IsOptional()
  @IsBoolean()
  dislike: boolean;

  @IsOptional()
  @IsString()
  reviewId: string;
}

export class GetContactRequestByIdsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  ids: string[];
}

export class FilterAndPaginationContactRequestDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterContactRequestDto)
  filter: FilterContactRequestDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterContactRequestGroupDto)
  filterGroup: FilterContactRequestGroupDto;

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
