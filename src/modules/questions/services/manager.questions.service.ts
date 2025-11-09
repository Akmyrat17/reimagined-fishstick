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
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { QuestionsResponseDto } from '../dtos/response-questions.dto';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';

@Injectable()
export class ManagerQuestionsService {
  constructor(
    private readonly managerQuestionsRepository: ManagerQuestionsRepository,
    @InjectQueue('image-queue') private readonly imageQueue: Queue,
  ) { }

  async create(
    dto: QuestionsCreateDto,
    file?: Express.Multer.File,
  ): Promise<QuestionsEntity> {
    let filePath: string;
    const slug = makeSlug(dto.title);
    if (file) filePath =await this.enqueueImage(file,slug);
    const mapped = ManagerQuestionsMapper.toCreate(dto, slug,filePath);
    return await this.managerQuestionsRepository.save(mapped);
  }

  async update(  dto: QuestionsUpdateDto,questionId: number,file?: Express.Multer.File  ): Promise<QuestionsEntity> {
    const question = await this.managerQuestionsRepository.findOne({
      where: { id: questionId },
    });
    if (!question) throw new NotFoundException();
    const slug = dto.title ? makeSlug(dto.title) : question.slug;
    let filePath: string;
    if (file) filePath = await this.enqueueImage(file, slug);
    const mapped = ManagerQuestionsMapper.toUpdate(
      dto,
      questionId,
      filePath,
      slug,
    );
    return await this.managerQuestionsRepository.save(mapped);
  }

  async getAll(dto: QuestionsQueryDto) {
    const [entities, total] =
      await this.managerQuestionsRepository.findAll(dto);
    const mapped = entities.map((entity) => ManagerQuestionsMapper.toResponseSimple(entity))
    return new PaginationResponse<QuestionsResponseDto>(mapped, total, dto.page, dto.limit)
  }

  async getOne(id: number) {
    const entity = await this.managerQuestionsRepository.getOne(id)
    if (!entity) throw new NotFoundException()
    const mapped = ManagerQuestionsMapper.toResponseDetail(entity)
    return mapped
  }

  async remove(id: number) {
    const result = await this.managerQuestionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return `Product with ID ${id} successfully deleted`;
  }

  private async enqueueImage(
    file: Express.Multer.File,
    slug: string,
  ): Promise<string> {
    const { outputDir, finalFilename, publicUrl } =
      await ImageHelper.prepareUploadPath(
        `questions/${slug}`,
        file.originalname,
      );
    await this.imageQueue.add('process-image', {
      buffer: file.buffer,
      filename: finalFilename,
      outputDir,
    });
    return publicUrl;
  }
}
