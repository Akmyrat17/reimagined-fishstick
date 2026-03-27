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
    if (dto.fullname) entity.fullname = dto.fullname
    if (dto.age) entity.age = dto.age
    if (dto.address_id) entity.address = new AddressesEntity({ id: dto.address_id })
    if (dto.profession_id) entity.profession = new ProfessionsEntity({ id: dto.profession_id })
    if (dto.tag_ids) entity.tags = dto.tag_ids.map((id) => new TagsEntity({ id }))
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
    response.fullname = usersEntity.fullname
    return response
  }
}
