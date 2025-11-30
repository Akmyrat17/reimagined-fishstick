import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { ManagerAnswersRepository } from '../repositories/manager.answers.repository';
import { AnswersCreateDto } from '../dtos/create-answers.dto';
import { ManagerAnswersMapper } from '../mappers/manager.answers.mapper';
import { AnswersUpdateDto } from '../dtos/update-answers.dto';
import { AnswersResponseDto } from '../dtos/response-answers.dto';
import { AnswersQueryDto } from '../dtos/query-answers.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ManagerAnswersService {
  private readonly baseUrl:string
  constructor(
    private readonly managerAnswersRepository: ManagerAnswersRepository,
    private readonly configService:ConfigService
  ) { 
    this.baseUrl = configService.get<string>('APP_URL')
  }

  async create(dto: AnswersCreateDto) {
    const mapped = ManagerAnswersMapper.toCreate(dto)
    return await this.managerAnswersRepository.save(mapped)
  }

  async update(dto: AnswersUpdateDto, id: number) {
    const entity = await this.managerAnswersRepository.getOne(id)
    if (!entity) throw new NotFoundException()
    const mapped = ManagerAnswersMapper.toUpdate(dto, id)
    return await this.managerAnswersRepository.save(mapped)
  }

  async getAll(dto: AnswersQueryDto) {
    const [entities, total] = await this.managerAnswersRepository.findAll(dto);
    const mapped = entities.map((entity) => {
      const dto = ManagerAnswersMapper.toResponseSimple(entity)
      return dto
    })
    return new PaginationResponse<AnswersResponseDto>(mapped, total, dto.page, dto.limit)
  }

  async getOne(id: number) {
    const entity = await this.managerAnswersRepository.getOne(id)
    if (!entity) throw new NotFoundException()
    const mapped = ManagerAnswersMapper.toResponseDetail(entity)
    return mapped
  }

  async remove(id: number) {
    const result = await this.managerAnswersRepository.findOne({where:{id}});
    if (!result) throw new NotFoundException()
    return await this.managerAnswersRepository.remove(result)
  }
}
