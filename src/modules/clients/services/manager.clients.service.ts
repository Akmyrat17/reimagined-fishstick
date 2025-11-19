import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ImageHelper } from 'src/common/utils/image.helper';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { ManagerClientsRepository } from '../repositories/manager.clients.repository';
import { ClientsCreateDto } from '../dtos/create-clients.dto';
import { ClientsEntity } from '../entities/clients.entity';
import { makeSlug } from 'src/common/utils/slug.helper';
import { ManagerClientsMapper } from '../mappers/manager.clients.mapper';
import { ClientsUpdateDto } from '../dtos/update-clients.dto';
import { ClientsQueryDto } from '../dtos/query-clients.dto';
import { ClientsResponseDto } from '../dtos/response-clients.dto';

@Injectable()
export class ManagerClientsService {
  constructor(
    private readonly managerClientsRepository: ManagerClientsRepository,
    // @InjectQueue('image-queue') private readonly imageQueue: Queue,
  ) { }

  async create(
    dto: ClientsCreateDto,
    files?: Express.Multer.File[],
  ): Promise<ClientsEntity> {
    let filePaths: string[];
    const slug = makeSlug(dto.company_name)
    if (files && files.length > 0) {
        for (let file of files) {
            let path = await this.enqueueImage(file,slug)
            filePaths.push(path)
        }
    }
    const mapped = ManagerClientsMapper.toCreate(dto,filePaths,slug);
    return await this.managerClientsRepository.save(mapped);
  }

  async update(
    dto: ClientsUpdateDto,
    clientId: number,
    files?: Express.Multer.File[],
  ): Promise<ClientsEntity> {
    const client = await this.managerClientsRepository.findOne({where: { id: clientId }});
    if (!client) throw new NotFoundException();
    let filePaths: string[];
    const slug = dto.company_name ? makeSlug(dto.company_name) : client.slug
    if (files && files.length > 0) {
        for (let file of files) {
            let path = await this.enqueueImage(file,slug)
            filePaths.push(path)
        }
    }
    const mapped = ManagerClientsMapper.toUpdate(dto,clientId,slug,filePaths);
    return await this.managerClientsRepository.save(mapped);
  }

  async getAll(dto: ClientsQueryDto) {
    const [entities, total] =
      await this.managerClientsRepository.findAll(dto);
    const mapped = entities.map((entity) =>ManagerClientsMapper.toResponseSimple(entity))
    return new PaginationResponse<ClientsResponseDto>(mapped, total, dto.page, dto.limit)
  }

  async getOne(id: number) {
    const entity = await this.managerClientsRepository.getOne(id)
    if (!entity) throw new NotFoundException()
    const mapped = ManagerClientsMapper.toResponseDetail(entity)
    return mapped
  }

  async remove(id: number) {
    const result = await this.managerClientsRepository.delete(id);
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
    // await this.imageQueue.add('process-image', {
    //   buffer: file.buffer,
    //   filename: finalFilename,
    //   outputDir,
    // });
    return publicUrl;
  }
}
