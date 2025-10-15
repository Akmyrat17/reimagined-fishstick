import { QuestionsResponseDto } from "src/modules/questions/dtos/response-questions.dto"
import { UsersEntity } from "src/modules/users/entities/user.entity"

export class AnswersResponseDto {
    id:number
    content:string
    file_path:string
    answered_to:QuestionsResponseDto
    answered_by:UsersEntity
}