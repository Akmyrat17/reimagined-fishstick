import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { RolesEnum } from 'src/common/enums';
import { ManagerUsersRepository } from '../repositories/manager.users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { UsersMapper } from '../mappers';

@Injectable()
export class ManagerUsersService {
  constructor(private managerUsersRepository: ManagerUsersRepository) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.managerUsersRepository.findOne({ where: { fullname: createUserDto.fullname } })
      if (existingUser) throw new ConflictException(`Username '${createUserDto.fullname}' already exists`)
      const existingPhone = await this.managerUsersRepository.findOne({ where: { phone_number: createUserDto.phone_number } });
      if (existingPhone) throw new ConflictException(`Phone number '${createUserDto.phone_number}' already exists`)
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.managerUsersRepository.create({ ...createUserDto, password: hashedPassword, role: createUserDto.role || RolesEnum.USER });
      return await user.save();
    } catch (error) {
      throw new BadRequestException(error.message || error.details);
    }
  }

  async findAll(paginationDto: PaginationRequestDto): Promise<PaginationResponse<any>> {
    const [data, total] = await this.managerUsersRepository.findAll(paginationDto);
    return new PaginationResponse(data, total, paginationDto.page, paginationDto.limit);
  }

  async findOne(id: number) {
    const user = await this.managerUsersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.managerUsersRepository.findOne({ where: { id } });
    if (!existingUser) throw new NotFoundException(`User with ID ${id} not found`);
    const mapped = UsersMapper.toUpdate(updateUserDto, id)
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
    const user = await this.managerUsersRepository.findOne({ where: { fullname: username } });
    if (!user) throw new NotFoundException(`User with username '${username}' not found`);
    return user
  }
}
