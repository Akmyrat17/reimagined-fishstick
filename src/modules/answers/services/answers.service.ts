import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { AnswersCreateDto } from '../dtos/create-answers.dto';
import { AnswersUpdateDto } from '../dtos/update-answers.dto';
import { AnswersResponseDto } from '../dtos/response-answers.dto';
import { AnswersRepository } from '../repositories/answers.repository';
import { AnswersMapper } from '../mappers/answers.mapper';
import { AnswersEntity } from '../entities/answers.entity';
import { ImageHelper } from 'src/common/utils/image.helper';
import { VotesRepository } from 'src/modules/votes/repositories/votes.repository';
import { UsersEntity } from 'src/modules/users/entities/users.entity';

@Injectable()
export class AnswersService {
  constructor(private readonly answersRepository: AnswersRepository, private readonly votesRepository: VotesRepository) { }

  async create(dto: AnswersCreateDto, user: UsersEntity) {
    if (!user.is_verified) throw new ForbiddenException("User is not verified");
    const mapped = AnswersMapper.toCreate(dto, user.id, user.role);
    return await this.answersRepository.save(mapped);
  }

  async update(dto: AnswersUpdateDto, id: number, user: UsersEntity) {
    const entity = await this.answersRepository.findOne({ where: { id, answered_by: { id: user.id } } });
    if (!entity) throw new ForbiddenException('Answer not found or you do not have permission to update this answer');
    const mapped = AnswersMapper.toUpdate(dto, id, user.role);
    if (dto.content) {
      let oldImageUrls = ImageHelper.extractImageUrls(entity.content)
      let newImageUrls = ImageHelper.extractImageUrls(dto.content)
      let mustDeleteUrls = oldImageUrls.filter(url => !newImageUrls.includes(url))
      ImageHelper.deleteImages(mustDeleteUrls)
    }
    return await this.answersRepository.save(mapped);
  }

  async getAll(dto: PaginationRequestDto, userId: number, othersProfileAnswers: boolean) {
    try {
      const [entities, total] = await this.answersRepository.findAll(dto, userId, othersProfileAnswers);
      const mapped = entities.map((entity) => AnswersMapper.toResponseSimple(entity));
      return new PaginationResponse<AnswersResponseDto>(mapped, total, dto.page, dto.limit);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async remove(id: number, userId: number) {
    const entity = await this.answersRepository.findOne({ where: { id, answered_by: { id: userId } } });
    if (!entity) throw new ForbiddenException();
    await this.removeByEntities([entity])
    return { success: true, message: 'Answer deleted successfully' };
  }

  async removeByEntities(entities: AnswersEntity[]) {
    let mustDeleteUrls = []
    entities.map(e => {
      let imageUrls = ImageHelper.extractImageUrls(e.content)
      if (imageUrls.length > 0) mustDeleteUrls.push(...imageUrls)
    })
    ImageHelper.deleteImages(mustDeleteUrls)
    await this.answersRepository.remove(entities)
    let ids = entities.map(e => e.id)
    if (ids.length > 0) await this.votesRepository.removeByTypeIds(ids, 'answers')
  }

  async lastHourAnswers() {
    return await this.answersRepository.getLastHourAnswers();
  }

  async getByQuestionId(questionId: number, dto: PaginationRequestDto, userId?: number) {
    try {
      const [entities, total] = await this.answersRepository.getByQuestionId(questionId, dto, userId);
      const mapped = entities.map((entity) => AnswersMapper.toResponseRawForQuestionDetail(entity));
      return new PaginationResponse<AnswersResponseDto>(mapped, total, dto.page, dto.limit);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }
}
