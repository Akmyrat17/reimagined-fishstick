import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { QuestionsPriorityEnum } from 'src/common/enums';

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
    @IsBoolean()
    is_approved:boolean
  
  @IsOptional()
  @IsEnum(QuestionsPriorityEnum)
  priority: QuestionsPriorityEnum;
}