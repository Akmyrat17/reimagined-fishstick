import { QuestionsPriorityEnum } from "src/common/enums"
import { CheckStatusEnum } from "src/common/enums/check-status.enum"
import { AddressesEntity } from "src/modules/addresses/entities/addresses.entity"
import { AnswersResponseDto } from "src/modules/answers/dtos/response-answers.dto"
import { TagsResponseDto } from "src/modules/tags/dtos/response-tags.dto"
import { UsersResponseDto } from "src/modules/users/dtos/response-user.dto"

export class QuestionsResponseDto {
    id: number
    title: string
    content: string
    image_paths: string[]
    slug: string
    priority: QuestionsPriorityEnum
    asked_by: UsersResponseDto
    check_status: CheckStatusEnum
    special: string
    seen: number
    in_review: boolean
    answers_count: number
    mine: boolean
    created_at: Date
    updated_at: Date
    total_votes_count: number
    upvotes_count: number
    reported_reason: string
    downvotes_count: number
    tags: TagsResponseDto[]
    current_user_vote: number
    answers: AnswersResponseDto[]
    address: AddressesEntity
    files: number
    current_user_answered: boolean
}