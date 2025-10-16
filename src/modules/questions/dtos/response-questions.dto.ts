import { QuestionsPriorityEnum } from "src/common/enums"
import { CheckStatusEnum } from "src/common/enums/check-status.enum"
import { UsersEntity } from "src/modules/users/entities/user.entity"

export class QuestionsResponseDto {
    id:number
    title:string
    content:string
    file_path:string
    slug:string
    priority:QuestionsPriorityEnum
    asked_by:UsersEntity
    check_status:CheckStatusEnum
}