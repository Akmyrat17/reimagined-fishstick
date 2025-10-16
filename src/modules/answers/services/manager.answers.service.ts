import { Injectable, NotFoundException } from '@nestjs/common';
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
import { AnswersQueryDto } from '../dtos/query-answers.dto';

@Injectable()
export class ManagerAnswersService {
  constructor(
    private readonly managerAnswersRepository: ManagerAnswersRepository,
    @InjectQueue('image-queue') private readonly imageQueue: Queue,
  ) { }

  async create(
    dto: AnswersCreateDto,
    file?: Express.Multer.File,
  ): Promise<AnswersEntity> {
    let filePath: string;
    if (file) filePath =await this.enqueueImage(file,file.filename);
    const mapped = ManagerAnswersMapper.toCreate(dto,filePath);
    return await this.managerAnswersRepository.save(mapped);
  }

  async update(
    dto: AnswersUpdateDto,
    answerId: number,
    file?: Express.Multer.File,
  ): Promise<AnswersEntity> {
    const question = await this.managerAnswersRepository.findOne({where: { id: answerId }});
    if (!question) throw new NotFoundException();
    let filePath: string;
    if (file) filePath = await this.enqueueImage(file, file.filename);
    const mapped = ManagerAnswersMapper.toUpdate(dto,answerId,filePath);
    return await this.managerAnswersRepository.save(mapped);
  }

  async getAll(dto: AnswersQueryDto) {
    const [entities, total] =
      await this.managerAnswersRepository.findAll(dto);
    const mapped = entities.map((entity) =>ManagerAnswersMapper.toResponseSimple(entity))
    return new PaginationResponse<AnswersResponseDto>(mapped, total, dto.page, dto.limit)
  }

  async getOne(id: number) {
    const entity = await this.managerAnswersRepository.getOne(id)
    if (!entity) throw new NotFoundException()
    const mapped = ManagerAnswersMapper.toResponseDetail(entity)
    return mapped
  }

  async remove(id: number) {
    const result = await this.managerAnswersRepository.delete(id);
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
