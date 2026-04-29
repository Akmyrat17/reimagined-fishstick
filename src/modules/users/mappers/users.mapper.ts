import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersEntity } from '../entities/users.entity';
import { ProfessionsEntity } from 'src/modules/professions/entities/professions.entity';
import { TagsEntity } from 'src/modules/tags/entities/tags.entity';
import { UsersResponseDto } from '../dtos/response-user.dto';
import { ProfessionsMapper } from 'src/modules/professions/mappers/professions.mapper';
import { TagsMapper } from 'src/modules/tags/mappers/tags.mapper';
import { LangEnum } from 'src/common/enums';
import { AddressesEntity } from 'src/modules/addresses/entities/addresses.entity';

export class UsersMapper {
  public static profileUpdate(dto: UpdateUserDto, id: number) {
    const entity = new UsersEntity({ id })
    entity.fullname = dto.fullname
    entity.age = dto.age ? dto.age : null
    entity.address = dto.address_id ? new AddressesEntity({ id: dto.address_id }) : null
    entity.profession = dto.profession_id ? new ProfessionsEntity({ id: dto.profession_id }) : null
    entity.tags = dto.tag_ids && dto.tag_ids.length > 0 ? dto.tag_ids.map((id) => new TagsEntity({ id })) : null
    return entity
  }

  public static responseProfile(usersEntity: UsersEntity, lang: LangEnum) {
    const response = new UsersResponseDto()
    response.id = usersEntity.id
    response.fullname = usersEntity.fullname
    response.email = usersEntity.email
    response.age = usersEntity.age
    response.address = usersEntity.address
    response.profession = usersEntity.profession ? ProfessionsMapper.toResponse(usersEntity.profession, lang) : null
    response.tags = (usersEntity.tags && usersEntity.tags.length > 0) ? usersEntity.tags.map((tag) => TagsMapper.toResponse(tag, lang)) : []
    response.created_at = usersEntity.created_at
    return response
  }

  public static toResponseSimple(usersEntity: UsersEntity) {
    const response = new UsersResponseDto()
    response.id = usersEntity.id
    response.role = usersEntity.role
    response.email = usersEntity.email
    response.fullname = usersEntity.fullname
    return response
  }
}
