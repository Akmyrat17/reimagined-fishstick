import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { ManagerAnswersRepository } from '../repositories/manager.answers.repository';
import { AnswersCreateDto } from '../dtos/create-answers.dto';
import { ManagerAnswersMapper } from '../mappers/manager.answers.mapper';
import { AnswersUpdateDto } from '../dtos/update-answers.dto';
import { AnswersResponseDto } from '../dtos/response-answers.dto';
import { AnswersQueryDto } from '../dtos/query-answers.dto';
import { UsersEntity } from 'src/modules/users/entities/users.entity';

@Injectable()
export class ManagerAnswersService {
  constructor(private readonly managerAnswersRepository: ManagerAnswersRepository) { }

  async create(dto: AnswersCreateDto, user: UsersEntity) {
    const mapped = ManagerAnswersMapper.toCreate(dto, user)
    return await this.managerAnswersRepository.save(mapped)
  }

  async update(dto: AnswersUpdateDto, id: number) {
    try {
      const entity = await this.managerAnswersRepository.findOne({ where: { id } })
      if (!entity) throw new NotFoundException()
      const mapped = ManagerAnswersMapper.toUpdate(dto, id)
      return await this.managerAnswersRepository.save(mapped)
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async getAll(dto: AnswersQueryDto) {
    try {
      const [entities, total] = await this.managerAnswersRepository.findAll(dto);
      const mapped = entities.map((entity) => ManagerAnswersMapper.toResponseSimple(entity))
      return new PaginationResponse<AnswersResponseDto>(mapped, total, dto.page, dto.limit)
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.managerAnswersRepository.findOne({ where: { id } });
      if (!result) throw new NotFoundException()
      return await this.managerAnswersRepository.delete(id)
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }
}
