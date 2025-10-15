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
        @InjectQueue('image-queue') private readonly imageQueue: Queue,
    ) { }

    async create(
        dto: QuestionsCreateDto,
        userId: number,
        file?: Express.Multer.File
    ): Promise<QuestionsEntity> {
        let filePath: string;
        const slug = makeSlug(dto.title);
        if (file) filePath = this.enqueueImage(file);
        const mapped = QuestionsMapper.toCreate(dto, slug, filePath, userId);
        return await this.questionsRepository.save(mapped);
    }

    async update(
        dto: QuestionsUpdateDto,
        questionId: number,
        userId: number,
        file?: Express.Multer.File,
    ): Promise<QuestionsEntity> {
        try {
            const question = await this.questionsRepository.findOne({
                where: { id: questionId, asked_by: { id: userId } },
            });
            if (!question) throw new ForbiddenException()
            const slug = dto.title ? makeSlug(dto.title) : question.slug;
            let filePath: string;
            if (file) filePath = await this.enqueueImage(file, slug);
            const mapped = QuestionsMapper.toUpdate(
                dto,
                questionId,
                filePath,
                slug,
            );
            return await this.questionsRepository.save(mapped);
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async getAll(dto: PaginationRequestDto) {
        try {
            const [entities, total] =
                await this.questionsRepository.findAll(dto);
            const mapped = entities.map((entity) => QuestionsMapper.toResponseSimple(entity))
            return new PaginationResponse<QuestionsResponseDto>(mapped, total, dto.page, dto.limit)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async getOne(id: number) {
        try {
            const entity = await this.questionsRepository.getOne(id)
            if (!entity) throw new NotFoundException()
            const mapped = QuestionsMapper.toResponseDetail(entity)
            return mapped
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async remove(id: number, userId: number) {
        try {
            const entity = await this.questionsRepository.findOne({ where: { id, asked_by: { id: userId } } })
            if (!entity) throw new ForbiddenException()
            return await this.questionsRepository.remove(entity)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    private async enqueueImage(
        file: Express.Multer.File,
        slug: string,
    ): Promise<string> {
        try {
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
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
