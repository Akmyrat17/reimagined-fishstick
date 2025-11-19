import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { QuestionsPriorityEnum } from 'src/common/enums';
import { CheckStatusEnum } from 'src/common/enums/check-status.enum';
import { IsToday } from 'src/common/validators/is-today';

export class QuestionsUpdateDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(CheckStatusEnum)
  check_status: CheckStatusEnum

  @IsOptional()
  @IsString()
  reported_reason: string;

  @IsOptional()
  @IsEnum(QuestionsPriorityEnum)
  priority: QuestionsPriorityEnum;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : value)
  @IsDate()
  @IsToday()
  special: Date
}