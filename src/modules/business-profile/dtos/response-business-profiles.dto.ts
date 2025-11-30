import { CheckStatusEnum } from "src/common/enums/check-status.enum"

export class BusinessProfilesResponseDto{
    id:number
    company_name:string
    description:string
    location:string
    phone_number:number
    web_url:string
    file_paths:string[]
    subscription_date:Date
    is_active:boolean
    longitude:number
    check_status:CheckStatusEnum
    latitude:number
}