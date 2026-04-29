import { Injectable, NotFoundException } from '@nestjs/common';
import { ManagerFeedbacksRepository } from '../repositories/manager.feedbacks.repository';
import { FeedbacksReplyDto } from '../dtos/reply-feedbacks.dto';
import { GmailHelper } from 'src/common/utils/gmail.helper';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { FeedbacksQueryDto } from '../dtos/query-feedbacks.dto';
import { resolveTimeRange } from 'src/common/utils/time-range.helper';

@Injectable()
export class ManagerFeedbacksService {
  constructor(
    private readonly managerFeedbacksRepository: ManagerFeedbacksRepository,
  ) { }

  async reply(dto: FeedbacksReplyDto, id: number) {
    try {
      const feedback = await this.managerFeedbacksRepository.findOne({
        where: { id },
      });
      if (!feedback) throw new NotFoundException();
      feedback.reply = dto.reply;
      await GmailHelper.SendFeedbackReplyEmail(
        feedback.email,
        feedback.content,
        dto.reply,
      );
      feedback.is_read = true;
      return await this.managerFeedbacksRepository.save(feedback);
    } catch (e) {
      console.log(e);
    }
  }

  async getAll(dto: FeedbacksQueryDto) {
    const { startDate, endDate } = resolveTimeRange(dto.time_range, dto.from, dto.to);
    const [entities, total] = await this.managerFeedbacksRepository.getAll(dto, startDate, endDate);
    return new PaginationResponse(entities, total, dto.page, dto.limit);
  }

  async getOne(id: number) {
    const entity = await this.managerFeedbacksRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException();
    if (!entity.is_read) {
      entity.is_read = true;
      await this.managerFeedbacksRepository.save(entity);
    }
    return entity;
  }

  async delete(id: number) {
    const entity = await this.managerFeedbacksRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException();
    const result = await this.managerFeedbacksRepository.delete(id);
    return { success: result.affected > 0 };
  }
}
