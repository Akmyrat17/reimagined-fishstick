import { CheckStatusEnum } from "src/common/enums/check-status.enum"
import { QuestionsResponseDto } from "src/modules/questions/dtos/response-questions.dto"
import { UsersResponseDto } from "src/modules/users/dtos/response-user.dto"
import { UsersEntity } from "src/modules/users/entities/user.entity"

export class AnswersResponseDto {
    id:number
    content:string
    file_path:string
    answered_to:QuestionsResponseDto
    answered_by:UsersResponseDto
    check_status:CheckStatusEnum
}