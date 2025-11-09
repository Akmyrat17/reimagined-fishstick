import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersEntity } from '../entities/user.entity';

export class UsersMapper {
  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    const user = new UsersEntity();
    user.fullname = createUserDto.fullname;
    user.password = createUserDto.password;
    user.phone_number = createUserDto.phone_number;
    await user.save();
    delete user.password;
    return user;
  }

  public static toUpdate(dto:UpdateUserDto,id:number) {
    const entity = new UsersEntity({id})
    if(dto.age) entity.age = dto.age
    if(dto.fullname) entity.fullname = dto.fullname
    if(dto.location) entity.location = dto.location
    if(dto.nickname) entity.nickname = dto.nickname
    if(dto.phone_number) entity.phone_number = dto.phone_number
    return entity
  }

  async responseUser(usersEntity: UsersEntity) { }
}
