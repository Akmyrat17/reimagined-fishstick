import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersEntity } from '../entities/user.entity';

export class UsersMapper {
  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    const user = new UsersEntity();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.phone_number = createUserDto.phone_number;
    await user.save();
    delete user.password;
    return user;
  }

  async responseUser(usersEntity: UsersEntity) { }
}
