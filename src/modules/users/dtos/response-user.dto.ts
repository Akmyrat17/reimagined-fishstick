import { AnswersResponseDto } from "src/modules/answers/dtos/response-answers.dto"
import { ProfessionsResponseDto } from "src/modules/professions/dtos/response-professions.dto"
import { QuestionsResponseDto } from "src/modules/questions/dtos/response-questions.dto"
import { TagsResponseDto } from "src/modules/tags/dtos/response-tags.dto"

export class UsersResponseDto {
    id:number
    fullname:string
    email:string
    age:number
    profession:ProfessionsResponseDto
    tags:TagsResponseDto[]
    questions:QuestionsResponseDto[]
    answers:AnswersResponseDto[]
    created_at:Date
    updated_at:Date
}