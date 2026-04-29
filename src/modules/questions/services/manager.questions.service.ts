import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ManagerQuestionsRepository } from '../repositories/manager.questions.repository';
import { QuestionsCreateDto } from '../dtos/create-questions.dto';
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
import { TimeRangeDto } from 'src/common/dto/time-range.dto';
import { ImageHelper } from 'src/common/utils/image.helper';

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

  async getTotalQuestions(dto: TimeRangeDto) {
    try {
      const allTimeData = await this.managerQuestionsRepository.getTotalQuestions();
      // const { startDate, endDate, truncUnit, labelFormat } = this.resolveDateRange(dto.time_range, dto.from, dto.to);
      // const filteredData = await this.managerQuestionsRepository.getQuestionsChartData(startDate, endDate, truncUnit, labelFormat);
      const filteredData = await this.managerQuestionsRepository.getQuestionsLastHourChart();
      return { allTimeData, filteredData };
    } catch (error: any) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async getQuestionsChartData(dto: TimeRangeDto) {
    const { startDate, endDate, truncUnit, labelFormat } = this.resolveDateRange(dto.time_range, dto.from, dto.to);
    return this.managerQuestionsRepository.getQuestionsChartData(startDate, endDate, truncUnit, labelFormat);
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
    } catch (error: any) {
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
    try {
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      if (dto.time_range) {
        const { startDate: resolvedStartDate, endDate: resolvedEndDate } = this.resolveDateRange(dto.time_range, dto.from, dto.to);
        startDate = resolvedStartDate;
        endDate = resolvedEndDate;
      }
      // const { startDate, endDate } = this.resolveDateRange(dto.time_range, dto.from, dto.to);
      const [entities, total] = await this.managerQuestionsRepository.findAll(dto, startDate, endDate);
      const mapped = entities.map((entity) => {
        const mapped = ManagerQuestionsMapper.toResponseRaw(entity, lang);
        const totalImages = ImageHelper.extractImageUrls(mapped.content)
        mapped.files = totalImages.length;
        return mapped;
      });
      return new PaginationResponse<QuestionsResponseDto>(mapped, total, dto.page, dto.limit,);
    } catch (error: any) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
  }

  async getAllByUserId(userId: number, lang: LangEnum) {
    try {
      const entities = await this.managerQuestionsRepository.getAllByUserId(userId);
      const mapped = entities.map((entity) => {
        const mapped = ManagerQuestionsMapper.toResponseRaw(entity, lang);
        const totalImages = ImageHelper.extractImageUrls(mapped.content)
        mapped.files = totalImages.length;
        return mapped;
      });
      return mapped;
    } catch (error: any) {
      console.error(error);
      throw new BadRequestException(error.detail || error.message);
    }
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

  private resolveDateRange(type: 'today' | 'week' | 'month' | 'custom', from?: Date, to?: Date) {
    const endDate = to ?? new Date();
    let startDate: Date;
    let truncUnit: 'hour' | 'day' | 'month';
    let labelFormat: string;

    switch (type) {
      case 'today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        truncUnit = 'hour';
        labelFormat = 'HH24:00';
        break;
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        truncUnit = 'day';
        labelFormat = 'Mon DD';
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        truncUnit = 'day';
        labelFormat = 'Mon DD';
        break;
      case 'custom':
        if (!from || !to) throw new BadRequestException('from and to are required for custom type');
        startDate = from;
        const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        truncUnit = diffDays > 60 ? 'month' : 'day';
        labelFormat = diffDays > 60 ? 'Mon YYYY' : 'Mon DD';
        break;
    }

    return { startDate, endDate, truncUnit, labelFormat };
  }
}
