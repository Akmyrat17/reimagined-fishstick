import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { QuestionsPriorityEnum } from 'src/common/enums';
import { CheckStatusEnum } from 'src/common/enums/check-status.enum';

export class QuestionsUpdateDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  asked_by_id: number;

  @IsOptional()
  @IsEnum(CheckStatusEnum)
  check_status: CheckStatusEnum

  @IsOptional()
  @IsEnum(QuestionsPriorityEnum)
  priority: QuestionsPriorityEnum;

  @IsOptional()
  @IsDate()
  special: Date
}