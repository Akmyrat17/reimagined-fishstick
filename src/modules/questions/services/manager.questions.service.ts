import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ManagerQuestionsRepository } from '../repositories/manager.questions.repository';
import { QuestionsCreateDto } from '../dtos/create-questions.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { makeSlug } from 'src/common/utils/slug.helper';
import { ManagerQuestionsMapper } from '../mappers/manager.questions.mapper';
import { QuestionsEntity } from '../entities/questions.entity';
import { QuestionsUpdateDto } from '../dtos/update-questions.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { QuestionsResponseDto } from '../dtos/response-questions.dto';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';
import { ConfigService } from '@nestjs/config';
import { CheckStatusEnum, LangEnum, RolesEnum } from 'src/common/enums';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { GmailHelper } from 'src/common/utils/gmail.helper';
import { TagsEntity } from 'src/modules/tags/entities/tags.entity';

@Injectable()
export class ManagerQuestionsService {
  private readonly appUrl: string;
  constructor(
    private readonly managerQuestionsRepository: ManagerQuestionsRepository,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository
  ) {
    this.appUrl = configService.get<string>('APP_URL');
  }

  async create(dto: QuestionsCreateDto, userRole: RolesEnum): Promise<QuestionsEntity> {
    const mapped = ManagerQuestionsMapper.toCreate(dto, userRole);
    const saved = await this.managerQuestionsRepository.save(mapped);
    return saved;
  }

  async update(dto: QuestionsUpdateDto, questionId: number) {
    try {
      const question = await this.managerQuestionsRepository.findOne({ where: { id: questionId }, relations: ['asked_by', 'tags'] });
      if (!question) throw new NotFoundException();
      const mapped = ManagerQuestionsMapper.toUpdate(dto, question);
      if (question.check_status !== mapped.check_status && question.asked_by.role === RolesEnum.USER) {
        await this.sendGmailsAboutStatusChange(mapped, question.check_status, mapped.check_status, question.asked_by.email, question.tags)
      }
      let previousSpecialQuestionId: number
      if (dto.special) previousSpecialQuestionId = await this.managerQuestionsRepository.setNullPreviousSpecial(dto.special)
      const updated = await this.managerQuestionsRepository.save(mapped);
      return { updated, previousSpecialQuestionId }
    } catch (error) {
      throw new BadRequestException(error.detail ? error.detail : error.message)
    }
  }

  async toggleInReviewTrue(id: number) {
    return await this.managerQuestionsRepository.update(id, { in_review: true });
  }

  async toggleInReviewFalse(id: number) {
    return await this.managerQuestionsRepository.update(id, { in_review: false });
  }

  async getAll(dto: QuestionsQueryDto, lang: LangEnum) {
    const [entities, total] = await this.managerQuestionsRepository.findAll(dto);
    const mapped = entities.map((entity) => ManagerQuestionsMapper.toResponseSimple(entity, lang));
    return new PaginationResponse<QuestionsResponseDto>(mapped, total, dto.page, dto.limit,);
  }

  async getOne(id: number, lang: LangEnum) {
    const entity = await this.managerQuestionsRepository.getOne(id);
    if (!entity) throw new NotFoundException();
    const mapped = ManagerQuestionsMapper.toResponseDetail(entity, lang);
    await this.toggleInReviewTrue(id);
    return mapped;
  }

  async remove(id: number) {
    const entity = await this.managerQuestionsRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException();
    return await this.managerQuestionsRepository.remove(entity);
  }

  async sendGmailsAboutStatusChange(question: QuestionsEntity, prevStatus: CheckStatusEnum, currentStatus: CheckStatusEnum, askedUserEmail: string, tags: TagsEntity[]) {
    if (currentStatus === CheckStatusEnum.APPROVED) {
      const userEmails = await this.usersRepository.getEmailsByTagIds(tags.map(tag => tag.id), askedUserEmail)
      await GmailHelper.SendNewQuestionNotificationToUsers(userEmails, question.title, question.content, tags.map(t => t.name))
    }
    await GmailHelper.SendQuestionStatusChangeEmail(askedUserEmail, question.title, prevStatus, currentStatus)
    console.log("Sent gmails successfully")
  }
}
