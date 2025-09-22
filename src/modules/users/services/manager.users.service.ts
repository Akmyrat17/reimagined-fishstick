import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { RolesEnum } from 'src/common/enums';
import { ManagerUsersRepository } from '../repositories/manager.users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';

@Injectable()
export class ManagerUsersService {
  constructor(private managerUsersRepository: ManagerUsersRepository) { }
  async create(createUserDto: CreateUserDto) {
    try {
      // Check if username already exists
      const existingUser = await this.managerUsersRepository.findOne({
        where: { username: createUserDto.username }
      });
      if (existingUser) {
        throw new ConflictException(`Username '${createUserDto.username}' already exists`);
      }

      // Check if phone number already exists
      const existingPhone = await this.managerUsersRepository.findOne({
        where: { phone_number: createUserDto.phone_number }
      });
      if (existingPhone) {
        throw new ConflictException(`Phone number '${createUserDto.phone_number}' already exists`);
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.managerUsersRepository.create({
        ...createUserDto,
        password: hashedPassword,
        role: createUserDto.role || RolesEnum.USER,
      });

      const savedUser = await user.save();
      return {
        success: true,
        message: 'User created successfully',
        data: savedUser
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async findAll(paginationDto: PaginationRequestDto): Promise<PaginationResponse<any>> {
    const [data, total] = await this.managerUsersRepository.findAll(paginationDto);
    return new PaginationResponse(data, total, paginationDto.page, paginationDto.limit);
  }

  async findOne(id: number) {
    const user = await this.managerUsersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      success: true,
      message: 'User found successfully',
      data: user
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if user exists
    const existingUser = await this.managerUsersRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check for conflicts if updating username or phone
    if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
      const userWithUsername = await this.managerUsersRepository.findOne({
        where: { username: updateUserDto.username }
      });
      if (userWithUsername) {
        throw new ConflictException(`Username '${updateUserDto.username}' already exists`);
      }
    }

    if (updateUserDto.phone_number && updateUserDto.phone_number !== existingUser.phone_number) {
      const userWithPhone = await this.managerUsersRepository.findOne({
        where: { phone_number: updateUserDto.phone_number }
      });
      if (userWithPhone) {
        throw new ConflictException(`Phone number '${updateUserDto.phone_number}' already exists`);
      }
    }

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const result = await this.managerUsersRepository.update(id, updateUserDto);

    if (result.affected === 0) {
      throw new BadRequestException(`Failed to update user with ID ${id}`);
    }

    // Get updated user
    const updatedUser = await this.managerUsersRepository.findOne({ where: { id } });

    return {
      success: true,
      message: `User with ID ${id} updated successfully`,
      data: updatedUser
    };
  }

  async remove(id: number) {
    // First check if user exists
    const user = await this.managerUsersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Delete the user
    const result = await this.managerUsersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Failed to delete user with ID ${id}`);
    }

    return {
      success: true,
      message: `User with ID ${id} successfully deleted`,
      deletedId: id
    };
  }

  async findOneByUsername(username: string) {
    const user = await this.managerUsersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }
    return {
      success: true,
      message: 'User found successfully',
      data: user
    };
  }
}
