import { Injectable, NotFoundException } from '@nestjs/common';
import { ManagerQuestionsRepository } from '../repositories/manager.questions.repository';
import { QuestionsCreateDto } from '../dtos/create-questions.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ImageHelper } from 'src/common/utils/image.helper';
import { makeSlug } from 'src/common/utils/slug.helper';
import { ManagerQuestionsMapper } from '../mappers/manager.questions.mapper';
import { QuestionsEntity } from '../entities/questions.entity';
import { QuestionsUpdateDto } from '../dtos/update-questions.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { QuestionsResponseDto } from '../dtos/response-questions.dto';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ManagerQuestionsService {
  private readonly baseUrl: string
  constructor(
    private readonly managerQuestionsRepository: ManagerQuestionsRepository,
    // @InjectQueue('image-queue') private readonly imageQueue: Queue,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = configService.get<string>('APP_URL')
  }

  async create(dto: QuestionsCreateDto): Promise<QuestionsEntity> {
    const slug = makeSlug(dto.title);
    const mapped = ManagerQuestionsMapper.toCreate(dto, slug);
    const updatedContent = await ImageHelper.processImagesFromContent(dto.content)
    mapped.content = updatedContent
    return await this.managerQuestionsRepository.save(mapped);
  }

  async update(dto: QuestionsUpdateDto, questionId: number): Promise<QuestionsEntity> {
    const question = await this.managerQuestionsRepository.findOne({where: { id: questionId }});
    if (!question) throw new NotFoundException();
    const mapped = ManagerQuestionsMapper.toUpdate(dto, questionId)
    if(dto.content){
      await ImageHelper.deleteImagesFromContent(question.content)
      const updatedContent =await ImageHelper.processImagesFromContent(dto.content)
      mapped.content = updatedContent
    }
    return await this.managerQuestionsRepository.save(mapped);
  }

  async getAll(dto: QuestionsQueryDto) {
    const [entities, total] =
      await this.managerQuestionsRepository.findAll(dto);
    const mapped = entities.map((entity) => {
      const dto = ManagerQuestionsMapper.toResponseSimple(entity)
      dto.content = ImageHelper.prependBaseUrl(dto.content,this.baseUrl)
      return dto
    })
    return new PaginationResponse<QuestionsResponseDto>(mapped, total, dto.page, dto.limit)
  }

  async getOne(id: number) {
    const entity = await this.managerQuestionsRepository.getOne(id)
    if (!entity) throw new NotFoundException()
    const mapped = ManagerQuestionsMapper.toResponseDetail(entity)
    mapped.content = ImageHelper.prependBaseUrl(mapped.content,this.baseUrl)
    return mapped
  }

  async remove(id: number) {
    const entity = await this.managerQuestionsRepository.findOne({where: { id }});
    if (!entity) throw new NotFoundException();
    await ImageHelper.deleteImagesFromContent(entity.content)
    return await this.managerQuestionsRepository.remove(entity);
  }
}
