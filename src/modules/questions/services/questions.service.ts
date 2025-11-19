import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsCreateDto } from '../dtos/create-questions.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ImageHelper } from 'src/common/utils/image.helper';
import { makeSlug } from 'src/common/utils/slug.helper';
import { QuestionsEntity } from '../entities/questions.entity';
import { QuestionsUpdateDto } from '../dtos/update-questions.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { QuestionsResponseDto } from '../dtos/response-questions.dto';
import { QuestionsRepository } from '../repositories/questions.repository';
import { QuestionsMapper } from '../mappers/questions.mapper';

@Injectable()
export class QuestionsService {
    constructor(
        private readonly questionsRepository: QuestionsRepository,
        // @InjectQueue('image-queue') private readonly imageQueue: Queue,
    ) { }

    async create(dto: QuestionsCreateDto, userId: number): Promise<QuestionsEntity> {
        const updatedContent = await ImageHelper.processImagesFromContent(dto.content);
        const mapped = QuestionsMapper.toCreate(dto, userId);
        mapped.content = updatedContent;
        return await this.questionsRepository.save(mapped);
    }

    async update(id: number, dto: QuestionsUpdateDto, userId: number): Promise<QuestionsEntity> {
        const existing = await this.questionsRepository.findOne({ where: { id, asked_by: { id: userId } } });
        if (!existing) throw new NotFoundException("Question not found");
        if (dto.content) {
            await ImageHelper.deleteImagesFromContent(existing.content);
            const updatedContent = await ImageHelper.processImagesFromContent(dto.content);
            const mapped = QuestionsMapper.toUpdate(dto, id)
            mapped.content = updatedContent;
            return await this.questionsRepository.save(mapped);
        }
        const mapped = QuestionsMapper.toUpdate(dto, id)
        return await this.questionsRepository.save(mapped);
    }


    async getAll(dto: PaginationRequestDto,userId:number) {
        const [entities, total] =
            await this.questionsRepository.findAll(dto);
        const mapped = entities.map((entity) => QuestionsMapper.toResponseSimple(entity,userId))
        return new PaginationResponse<QuestionsResponseDto>(mapped, total, dto.page, dto.limit)
    }

    async getOne(slug: string,userId:number) {
        const entity = await this.questionsRepository.getOne(slug)
        if (!entity) throw new NotFoundException()
        const mapped = QuestionsMapper.toResponseDetail(entity,userId)
        return mapped
    }

    async remove(id: number, userId: number) {
        const entity = await this.questionsRepository.findOne({ where: { id, asked_by: { id: userId } } })
        if (!entity) throw new ForbiddenException()
        await ImageHelper.deleteImagesFromContent(entity.content);
        return await this.questionsRepository.remove(entity)
    }
}
