import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { QuestionsPriorityEnum } from 'src/common/enums';
import { CheckStatusEnum } from 'src/common/enums/check-status.enum';

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
  @IsEnum(QuestionsPriorityEnum)
  priority: QuestionsPriorityEnum;
}