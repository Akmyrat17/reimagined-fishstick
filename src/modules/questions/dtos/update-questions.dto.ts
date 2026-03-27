import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDate, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
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
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  tag_ids?: number[];

  @IsOptional()
  @IsNumber()
  address_id: number

  @IsOptional()
  @IsEnum(QuestionsPriorityEnum)
  priority: QuestionsPriorityEnum;

  @IsOptional()
  @IsDateString({}, { message: 'special must be a valid ISO date (YYYY-MM-DD)' })
  special: string;
}