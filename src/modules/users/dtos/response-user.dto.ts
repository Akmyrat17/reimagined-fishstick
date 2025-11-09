import { ProfessionsResponseDto } from "src/modules/professions/dtos/response-professions.dto"
import { TagsResponseDto } from "src/modules/tags/dtos/response-tags.dto"

export class UsersResponseDto {
    id:number
    fullname:string
    email:string
    age:number
    profession:ProfessionsResponseDto
    tags:TagsResponseDto[]
    created_at:Date
}