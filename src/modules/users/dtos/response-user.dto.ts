import { RolesEnum } from "src/common/enums"
import { AddressesEntity } from "src/modules/addresses/entities/addresses.entity"
import { AnswersResponseDto } from "src/modules/answers/dtos/response-answers.dto"
import { PermissionsEntity } from "src/modules/permissions/entities/permissions.entity"
import { ProfessionsResponseDto } from "src/modules/professions/dtos/response-professions.dto"
import { QuestionsResponseDto } from "src/modules/questions/dtos/response-questions.dto"
import { TagsResponseDto } from "src/modules/tags/dtos/response-tags.dto"

export class UsersResponseDto {
    id: number
    fullname: string
    email: string
    age: number
    is_verified: boolean
    role: RolesEnum
    address?: AddressesEntity
    profession: ProfessionsResponseDto
    total_business_profiles: number
    tags: TagsResponseDto[]
    questions: QuestionsResponseDto[]
    answers: AnswersResponseDto[]
    is_blocked: boolean
    created_at: Date
    permissions:PermissionsEntity[]
    updated_at: Date
}