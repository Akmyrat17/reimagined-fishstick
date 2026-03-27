import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { QuestionsRepository } from '../repositories/questions.repository';
import { QuestionsMapper } from '../mappers/questions.mapper';
import { QuestionsCreateDto } from '../dtos/create-questions.dto';
import { QuestionsUpdateDto } from '../dtos/update-questions.dto';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';
import { QuestionsResponseDto } from '../dtos/response-questions.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { ConfigService } from '@nestjs/config';
import { CheckStatusEnum, LangEnum, RolesEnum } from 'src/common/enums';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { ImageHelper } from 'src/common/utils/image.helper';
import { AnswersService } from 'src/modules/answers/services/answers.service';
import { VotesRepository } from 'src/modules/votes/repositories/votes.repository';
import { In } from 'typeorm';
import { AnswersEntity } from 'src/modules/answers/entities/answers.entity';
import { UsersEntity } from 'src/modules/users/entities/users.entity';

@Injectable()
export class QuestionsService {
  private readonly baseUrl: string;
  constructor(private readonly questionsRepository: QuestionsRepository, private readonly configService: ConfigService, private readonly answersService: AnswersService, private readonly votesRepository: VotesRepository) {
    this.baseUrl = this.configService.get<string>('APP_URL');
  }

  async create(dto: QuestionsCreateDto, user: UsersEntity, lang: LangEnum): Promise<QuestionsResponseDto> {
    if (!user.is_verified) throw new ForbiddenException("User is not verified");
    const mapped = QuestionsMapper.toCreate(dto, user.id);
    if (user.role === RolesEnum.ADMIN) mapped.check_status = CheckStatusEnum.APPROVED
    const entity = await this.questionsRepository.save(mapped);
    return QuestionsMapper.toResponseDetail(entity, lang);
  }

  async update(id: number, dto: QuestionsUpdateDto, userId: number, lang: LangEnum): Promise<QuestionsResponseDto> {
    try {
      const existing = await this.questionsRepository.findOne({ where: { id, asked_by: { id: userId } } });
      if (!existing) throw new NotFoundException('Question not found');
      const mapped = QuestionsMapper.toUpdate(dto, id);
      if (dto.content && existing.content !== dto.content) {
        const existingImageUrls = ImageHelper.extractImageUrls(existing.content);
        const newImageUrls = ImageHelper.extractImageUrls(dto.content);
        const imageUrlsToDelete = existingImageUrls.filter(url => !newImageUrls.includes(url));
        await ImageHelper.deleteImages(imageUrlsToDelete);
      }
      const entity = await this.questionsRepository.save(mapped);
      return QuestionsMapper.toResponseDetail(entity, lang);
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Question not found');
    }
  }

  async getAll(dto: QuestionsQueryDto, userId?: number, lang?: LangEnum): Promise<PaginationResponse<QuestionsResponseDto>> {
    try {
      const [entities, total] = await this.questionsRepository.findAll(dto, userId);
      const items = entities.map(entity => QuestionsMapper.toResponseRaw(entity, userId || 0, lang));
      return new PaginationResponse<QuestionsResponseDto>(items, total, dto.page, dto.limit);
    } catch (error) {
      console.error(error);
      return new PaginationResponse<QuestionsResponseDto>([], 0, dto.page, dto.limit);
    }
  }

  async getOne(id: number, userId?: number, lang?: LangEnum) {
    const entity = await this.questionsRepository.getOne(id, userId);
    if (!entity) throw new NotFoundException('Question not found');
    if (userId) await this.questionsRepository.increaseSeen(userId, entity.id);
    const response = QuestionsMapper.responseRawGetOne(entity, userId, lang);
    const similarQuestions = await this.getSimilarQuestions(id, 1, 20)
    return { response, similar: similarQuestions.data };
  }

  async getSimilarQuestions(questionId: number, limit: number, page: number, userId?: number, lang?: LangEnum) {
    const [entities, total] = await this.questionsRepository.getSimilarQuestions(questionId, limit, page)
    const mapped = entities.map(q => QuestionsMapper.toResponseRaw(q, userId, lang))
    return new PaginationResponse(mapped, total, page, limit)
  }

  async remove(id: number, userId: number): Promise<{ success: boolean; message: string }> {
    const entity = await this.questionsRepository.findOne({ where: { id, asked_by: { id: userId } }, relations: ["answers"] });
    if (!entity) throw new ForbiddenException('You are not authorized to delete this question');
    const imageUrls = ImageHelper.extractImageUrls(entity.content);
    await ImageHelper.deleteImages(imageUrls);
    await this.votesRepository.removeByTypeIds([id], 'questions')
    await this.answersService.removeByEntities(entity.answers)
    await this.questionsRepository.remove(entity);
    return { success: true, message: 'Question deleted successfully' };
  }

  async removeByIds(ids: number[], userId: number) {
    const entities = await this.questionsRepository.find({ where: { id: In(ids), asked_by: { id: userId } }, relations: ["answers"] })
    if (entities.length == 0) return
    let imageUrls = []
    let answers: AnswersEntity[] = []
    entities.map(e => {
      imageUrls.push(ImageHelper.extractImageUrls(e.content))
      answers.push(...e.answers)
    })
    await ImageHelper.deleteImages(imageUrls)
    await this.votesRepository.removeByTypeIds(ids, 'questions')
    await this.answersService.removeByEntities(answers)
    await this.questionsRepository.remove(entities)
  }

  async lastHourQuestions() {
    return await this.questionsRepository.getLastHourQuestions();
  }

  async myQuestions(userId: number, dto: PaginationRequestDto, lang?: LangEnum) {
    const [entities, count] = await this.questionsRepository.getMyQuestions(userId, dto.page, dto.limit)
    const mapped = entities.map(q => QuestionsMapper.toResponseRaw(q, userId, lang))
    return new PaginationResponse(mapped, count, dto.page, dto.limit)
  }

  async getSpecialOnes(userId?: number, lang?: LangEnum) {
    const entities = await this.questionsRepository.findSpecial()
    const mapped = entities.map(q => QuestionsMapper.toResponseRaw(q, userId, lang))
    return mapped
  }
}
