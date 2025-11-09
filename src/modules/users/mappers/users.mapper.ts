import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersEntity } from '../entities/user.entity';
import { ProfessionsEntity } from 'src/modules/professions/entities/professions.entity';
import { TagsEntity } from 'src/modules/tags/entities/tags.entity';
import { UsersResponseDto } from '../dtos/response-user.dto';
import { ProfessionsMapper } from 'src/modules/professions/mappers/professions.mapper';
import { TagsMapper } from 'src/modules/tags/mappers/tags.mapper';
import { LangEnum } from 'src/common/enums';

export class UsersMapper {
  public static profileUpdate(dto:UpdateUserDto,id:number) {
    const entity = new UsersEntity({id})
    if(dto.fullname) entity.fullname = dto.fullname
    if(dto.email) entity.email = dto.email
    if(dto.age) entity.age = dto.age
    if(dto.profession_id) entity.profession = new ProfessionsEntity({id:dto.profession_id})
    if(dto.tag_ids) entity.tags = dto.tag_ids.map((id) => new TagsEntity({id}))
    return entity
  }

  public static responseProfile(usersEntity:UsersEntity,lang:LangEnum){
   const response = new UsersResponseDto()
   response.id = usersEntity.id
   response.fullname = usersEntity.fullname
   response.email = usersEntity.email
   response.age = usersEntity.age
   response.profession = ProfessionsMapper.toResponse(usersEntity.profession,lang)
   response.tags = usersEntity.tags.map((tag) => TagsMapper.toResponse(tag,lang))
   response.created_at = usersEntity.created_at
   return response 
  }

  public static toResponseSimple(usersEntity:UsersEntity){
    const response = new UsersResponseDto()
    response.id = usersEntity.id
    response.fullname = usersEntity.fullname
    return response 
  }
}
