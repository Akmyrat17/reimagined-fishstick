import { CheckStatusEnum } from "src/common/enums/check-status.enum"
import { QuestionsResponseDto } from "src/modules/questions/dtos/response-questions.dto"
import { UsersResponseDto } from "src/modules/users/dtos/response-user.dto"
import { UsersEntity } from "src/modules/users/entities/users.entity"

export class AnswersResponseDto {
    id: number
    content: string
    image_paths: string[]
    question: QuestionsResponseDto
    answered_by: UsersResponseDto
    check_status: CheckStatusEnum
    upvotes_count: number
    downvotes_count: number
    total_votes_count: number
    created_at: Date
    reported_reason: string
    deleted_at: Date
    current_user_vote: number
}