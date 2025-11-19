import { TagsEntity } from 'src/modules/tags/entities/tags.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersEntity } from '../entities/user.entity';
import { ProfessionsEntity } from 'src/modules/professions/entities/professions.entity';
import { UsersResponseDto } from '../dtos/response-user.dto';
import { ManagerAnswersMapper } from 'src/modules/answers/mappers/manager.answers.mapper';
import { ManagerQuestionsMapper } from 'src/modules/questions/mappers/manager.questions.mapper';
import { ManagerTagsMapper } from 'src/modules/tags/mappers/manager.tags.mapper';
import { ManagerProfessionsMapper } from 'src/modules/professions/mappers/manager.professions.mapper';
import { LangEnum } from 'src/common/enums';

export class ManagerUsersMapper {
  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    const user = new UsersEntity();
    user.fullname = createUserDto.fullname;
    user.password = createUserDto.password;
    user.email = createUserDto.email;
    user.role = createUserDto.role;
    user.profession = createUserDto.profession_id ? new ProfessionsEntity({id:createUserDto.profession_id}) : null;
    user.tags = (createUserDto.tag_ids && createUserDto.tag_ids.length > 0) ? createUserDto.tag_ids.map((id) => new TagsEntity({id})) : [];
    await user.save();
    delete user.password;
    return user;
  }

  public static toUpdate(dto:UpdateUserDto,id:number) {
    const entity = new UsersEntity({id})
    if(dto.profession_id) entity.profession = new ProfessionsEntity({id:dto.profession_id})
    if(dto.tag_ids) entity.tags = dto.tag_ids.map((id) => new TagsEntity({id}))
    if(dto.fullname) entity.fullname = dto.fullname
    if(dto.email) entity.email = dto.email
    if(dto.role) entity.role = dto.role
    if(dto.age) entity.age = dto.age
    return entity
  }

  public static responseOne(entity:UsersEntity,lang:LangEnum) {
    const dto = new UsersResponseDto()
    dto.id = entity.id
    dto.age = entity.age
    dto.email = entity.email
    dto.created_at = entity.created_at
    dto.updated_at = entity.updated_at
    dto.answers = entity.answers && entity.answers.length > 0 ? entity.answers.map(e=>ManagerAnswersMapper.toResponseSimple(e)) : [] 
    dto.questions = entity.questions && entity.questions.length > 0 ? entity.questions.map(e=>ManagerQuestionsMapper.toResponseSimple(e)) : [] 
    dto.tags = entity.tags && entity.tags.length > 0 ? entity.tags.map(e=>ManagerTagsMapper.toResponseSimple(e,lang)) : [] 
    dto.profession = entity.profession ? ManagerProfessionsMapper.toResponseSimple(entity.profession,lang) : null
    return dto
  }
}
