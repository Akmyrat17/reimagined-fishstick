import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { LangEnum, RolesEnum } from 'src/common/enums';
import { ManagerUsersRepository } from '../repositories/manager.users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { UsersMapper } from '../mappers';
import { ManagerUsersMapper } from '../mappers/manager.users.mapper';
import { UsersQueryDto } from '../dtos/query-users.dto';
import { PermissionsEntity } from 'src/modules/permissions/entities/permissions.entity';

@Injectable()
export class ManagerUsersService {
  constructor(private managerUsersRepository: ManagerUsersRepository) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.managerUsersRepository.findOne({ where: { fullname: createUserDto.fullname } })
      if (existingUser) throw new ConflictException(`Username '${createUserDto.fullname}' already exists`)
      const existingPhone = await this.managerUsersRepository.findOne({ where: { email: createUserDto.email } });
      if (existingPhone) throw new ConflictException(`Phone number '${createUserDto.email}' already exists`)
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.managerUsersRepository.create({ ...createUserDto, password: hashedPassword, role: createUserDto.role || RolesEnum.USER });
      return await user.save();
    } catch (error) {
      throw new BadRequestException(error.message || error.details);
    }
  }

  async findAll(paginationDto: UsersQueryDto, lang: LangEnum): Promise<PaginationResponse<any>> {
    try {
      const [data, total] = await this.managerUsersRepository.findAll(paginationDto);
      const mapped = data.map(user => ManagerUsersMapper.toResponseList(user, lang))
      return new PaginationResponse(mapped, total, paginationDto.page, paginationDto.limit);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async findOne(id: number, lang: LangEnum) {
    const user = await this.managerUsersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return ManagerUsersMapper.responseOne(user, lang)
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.managerUsersRepository.findOne({ where: { id }, relations: ['permissions'] });
    if (!existingUser) throw new NotFoundException(`User with ID ${id} not found`);
    const mapped = ManagerUsersMapper.toUpdate(updateUserDto, id)
    if (updateUserDto.permission_ids && updateUserDto.permission_ids.length > 0) {
      const existingPermissions = existingUser.permissions; // [1, 2, 3]
      const incomingIds = updateUserDto.permission_ids;     // [2, 4]

      // Toggle logic:
      // - 2 exists + sent → REMOVE
      // - 4 doesn't exist + sent → ADD
      // - 1, 3 exist + not sent → KEEP (unchanged)

      const existingIds = existingPermissions.map(p => p.id);

      // Keep permissions that were NOT in the incoming list
      const kept = existingPermissions.filter(p => !incomingIds.includes(p.id));

      // Add permissions that did NOT exist before
      const added = incomingIds
        .filter(permId => !existingIds.includes(permId))
        .map(permId => new PermissionsEntity({ id: permId }));

      mapped.permissions = [...kept, ...added];
    }
    if (updateUserDto.password) mapped.password = await bcrypt.hash(updateUserDto.password, 10);
    return await this.managerUsersRepository.save(mapped)
  }

  async remove(id: number) {
    const user = await this.managerUsersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    const result = await this.managerUsersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Failed to delete user with ID ${id}`);
  }

  async findOneByFullname(username: string) {
    const user = await this.managerUsersRepository.findOne({ where: { fullname: username }, relations: ['permissions'] });
    if (!user) throw new NotFoundException(`User with username '${username}' not found`);
    return user
  }
  async findOneById(id: number) {
    const user = await this.managerUsersRepository.findOne({ where: { id: id }, relations: ['permissions'] });
    if (!user) throw new NotFoundException(`User with id '${id}' not found`);
    return user
  }
}
