import { IsNotEmpty, IsString } from 'class-validator';
export class FeedbacksReplyDto {
  @IsNotEmpty()
  @IsString()
  reply: string;
}
