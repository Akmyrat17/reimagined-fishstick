
// src/modules/questions/services/questions.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { QuestionsRepository } from '../repositories/questions.repository';
import { QuestionsMapper } from '../mappers/questions.mapper';
import { QuestionsCreateDto } from '../dtos/create-questions.dto';
import { QuestionsUpdateDto } from '../dtos/update-questions.dto';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';
import { QuestionsResponseDto } from '../dtos/response-questions.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QuestionsService {
  private readonly baseUrl: string;

  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('APP_URL');
  }

  async create(dto: QuestionsCreateDto, userId: number) :Promise<QuestionsResponseDto>{
    // dto.content may be TipTap JSON or HTML. helper handles both.
    const mapped = QuestionsMapper.toCreate(dto, userId);
    const entity = await this.questionsRepository.save(mapped);
    return QuestionsMapper.toResponseDetail(entity, userId);
  }

  async update(id: number, dto: QuestionsUpdateDto, userId: number): Promise<QuestionsResponseDto> {
    const existing = await this.questionsRepository.findOne({ 
      where: { 
        id, 
        asked_by: { id: userId } 
      } 
    });
    
    if (!existing) {
      throw new NotFoundException('Question not found');
    }
    const mapped = QuestionsMapper.toUpdate(dto, id);
    const entity = await this.questionsRepository.save(mapped);
    return QuestionsMapper.toResponseDetail(entity, userId);
  }

  async getAll(dto: QuestionsQueryDto, userId?: number): Promise<PaginationResponse<QuestionsResponseDto>> {
    const [entities, total] = await this.questionsRepository.findAll(dto, userId);
    const items = entities.map(entity => {
      const item = QuestionsMapper.toResponseSimple(entity, userId || 0);
      return item;
    });
    return new PaginationResponse<QuestionsResponseDto>(items, total, dto.page, dto.limit);
  }

  async getOne(slug: string, userId?: number): Promise<QuestionsResponseDto> {
    const entity = await this.questionsRepository.getOne(slug);
    if (!entity) {
      throw new NotFoundException('Question not found');
    }

    // Track that user has seen this question
    if (userId)       await this.questionsRepository.increaseSeen(userId, entity.id);
    const response = QuestionsMapper.toResponseDetail(entity, userId || 0);
    return response;
  }

  async remove(id: number, userId: number): Promise<{ success: boolean; message: string }> {
    const entity = await this.questionsRepository.findOne({ 
      where: { 
        id, 
        asked_by: { id: userId } 
      } 
    });
    
    if (!entity) {
      throw new ForbiddenException('You are not authorized to delete this question');
    }
    await this.questionsRepository.remove(entity);
    
    return { success: true, message: 'Question deleted successfully' };
  }
}
