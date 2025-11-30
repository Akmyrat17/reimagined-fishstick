import {  IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { QuestionsPriorityEnum } from 'src/common/enums';

export class QuestionsCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber()
  asked_by_id:number

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  image_urls: string[];

  @IsArray()
  @IsOptional()
  tag_ids:number[]

  @IsOptional()
  @IsEnum(QuestionsPriorityEnum)
  priority: QuestionsPriorityEnum;
}