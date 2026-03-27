import { ContactsDto } from "src/common/dto/contacts.dto"
import { CheckStatusEnum } from "src/common/enums/check-status.enum"
import { UsersResponseDto } from "src/modules/users/dtos/response-user.dto"
import { WorkingHoursDto } from "./working-hours.dto"
import { TagsResponseDto } from "src/modules/tags/dtos/response-tags.dto"

export class BusinessProfilesResponseDto {
    id: number
    company_name: string
    description: string
    location: string
    phone_number: number
    image_paths: string[]
    subscription_date: Date
    is_active: boolean
    longitude: number
    check_status: CheckStatusEnum
    latitude: number
    user: UsersResponseDto
    service: string
    in_review: boolean
    contacts: ContactsDto[]
    working_hours: WorkingHoursDto[]
    tags: TagsResponseDto[]
}