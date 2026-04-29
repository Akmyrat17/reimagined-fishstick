import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
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
  @Transform(({ value }) => (value === '' ? null : value))
  @IsDateString({}, { message: 'special must be a valid ISO date (YYYY-MM-DD)' })
  @ValidateIf((o) => o.special !== null) // skip validation if null
  special: string | null;
}