import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ContactsTypeEnum } from "../enums/contacts-type.enum";

export class ContactsDto {
    @IsEnum(ContactsTypeEnum)
    type: ContactsTypeEnum

    @IsString()
    @IsNotEmpty()
    value: string;
}