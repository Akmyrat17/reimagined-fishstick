import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ImageHelper } from 'src/common/utils/image.helper';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { ManagerAnswersRepository } from '../repositories/manager.answers.repository';
import { AnswersCreateDto } from '../dtos/create-answers.dto';
import { AnswersEntity } from '../entites/answers.entity';
import { ManagerAnswersMapper } from '../mappers/manager.answers.mapper';
import { AnswersUpdateDto } from '../dtos/update-answers.dto';
import { AnswersResponseDto } from '../dtos/response-answers.dto';
import { AnswersRepository } from '../repositories/answers.repository';
import { AnswersMapper } from '../mappers/answers.mapper';

@Injectable()
export class AnswersService {
  constructor(
    private readonly answersRepository: AnswersRepository,
    @InjectQueue('image-queue') private readonly imageQueue: Queue,
  ) { }

  async create(
    dto: AnswersCreateDto,
    userId:number,
    file?: Express.Multer.File,
  ): Promise<AnswersEntity> {
    let filePath: string;
    if (file) filePath =await this.enqueueImage(file,file.filename);
    const mapped = AnswersMapper.toCreate(dto,filePath,userId);
    return await this.answersRepository.save(mapped);
  }

  async update(
    dto: AnswersUpdateDto,
    answerId: number,
    userId:number,
    file?: Express.Multer.File,
  ): Promise<AnswersEntity> {
    const question = await this.answersRepository.findOne({where: { id: answerId,answered_by:{id:userId} }});
    if (!question) throw new ForbiddenException()
    let filePath: string;
    if (file) filePath = await this.enqueueImage(file, file.filename);
    const mapped = AnswersMapper.toUpdate(dto,answerId,filePath);
    return await this.answersRepository.save(mapped);
  }

  async getAll(dto: PaginationRequestDto) {
    const [entities, total] =
      await this.answersRepository.findAll(dto);
    const mapped = entities.map((entity) =>AnswersMapper.toResponseSimple(entity))
    return new PaginationResponse<AnswersResponseDto>(mapped, total, dto.page, dto.limit)
  }

  async getOne(id: number) {
    const entity = await this.answersRepository.getOne(id)
    if (!entity) throw new NotFoundException()
    const mapped = AnswersMapper.toResponseDetail(entity)
    return mapped
  }

  async remove(id: number,userId:number) {
    const entity = await this.answersRepository.findOne({where:{id,answered_by:{id:userId}}})
    if(!entity) throw new ForbiddenException()
    return await this.answersRepository.remove(entity)
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
