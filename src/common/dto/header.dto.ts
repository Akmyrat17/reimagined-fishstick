import { Expose } from 'class-transformer';
import { IsDefined, IsEnum, IsString } from 'class-validator';
import { LangEnum } from '../enums';

export class HeaderDTO {
  @IsString()
  @IsDefined()
  @IsEnum(LangEnum)
  @Expose({ name: 'lang' }) // required as headers are case insensitive
  lang: LangEnum;
}
