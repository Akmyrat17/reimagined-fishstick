import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { QuestionsPriorityEnum } from 'src/common/enums';

export class QuestionsCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber()
  asked_by_id:number

  @IsOptional()
  @IsBoolean()
  is_approved:boolean

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsEnum(QuestionsPriorityEnum)
  priority: QuestionsPriorityEnum;
}