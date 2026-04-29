import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { ManagerAnswersRepository } from '../repositories/manager.answers.repository';
import { AnswersCreateDto } from '../dtos/create-answers.dto';
import { ManagerAnswersMapper } from '../mappers/manager.answers.mapper';
import { AnswersUpdateDto } from '../dtos/update-answers.dto';
import { AnswersResponseDto } from '../dtos/response-answers.dto';
import { AnswersQueryDto } from '../dtos/query-answers.dto';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import { resolveTimeRange } from 'src/common/utils/time-range.helper';
import { CheckStatusEnum } from 'src/common/enums/check-status.enum';
import { GmailHelper } from 'src/common/utils/gmail.helper';

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
      const statusChanged = mapped.check_status && mapped.check_status !== entity.check_status;
      const shouldNotify = statusChanged && mapped.check_status !== CheckStatusEnum.DELETED && mapped.check_status !== CheckStatusEnum.NOT_CHECKED;
      if (shouldNotify && entity.answered_by?.email && entity.question?.title) {
        await GmailHelper.SendAnswerStatusChangeEmail(entity.answered_by.email, entity.question.title, entity.check_status, mapped.check_status, mapped.check_status === CheckStatusEnum.REPORTED ? mapped.reported_reason : undefined)
      }
      return await this.managerAnswersRepository.save(mapped)
    } catch (error: any) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }
  async getAnswersByUserId(userId: number) {
    try {
      const entities = await this.managerAnswersRepository.find({ where: { answered_by: { id: userId } }, relations: ['answered_by', 'question'] })
      return entities.map((entity) => ManagerAnswersMapper.toResponseSimple(entity))
    } catch (error: any) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async getAll(dto: AnswersQueryDto) {
    try {
      const { startDate, endDate } = resolveTimeRange(dto.time_range, dto.from, dto.to);
      const [entities, total] = await this.managerAnswersRepository.findAll(dto, startDate, endDate);
      const mapped = entities.map((entity) => ManagerAnswersMapper.toResponseSimple(entity))
      return new PaginationResponse<AnswersResponseDto>(mapped, total, dto.page, dto.limit)
    } catch (error: any) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.managerAnswersRepository.findOne({ where: { id } });
      if (!result) throw new NotFoundException()
      return await this.managerAnswersRepository.delete(id)
    } catch (error: any) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async getTotal() {
    try {
      return await this.managerAnswersRepository.getTotal();
    } catch (error: any) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }
}
