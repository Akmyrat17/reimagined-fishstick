import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { ManagerBusinessProfilesRepository } from '../repositories/manager.business-profiles.repository';
import { BusinessProfilesCreateDto } from '../dtos/create-business-profiles.dto';
import { BusinessProfilesEntity } from '../entities/business-profiles.entity';
import { makeSlug } from 'src/common/utils/slug.helper';
import { ManagerBusinessProfilesMapper } from '../mappers/manager.business-profiles.mapper';
import { BusinessProfilesUpdateDto } from '../dtos/update-business-profiles.dto';
import { BusinessProfilesQueryDto } from '../dtos/query-business-profiles.dto';
import { BusinessProfilesResponseDto } from '../dtos/response-business-profiles.dto';

@Injectable()
export class ManagerBusinessProfilesService {
  constructor(
    private readonly managerBusinessProfileRepository: ManagerBusinessProfilesRepository,
  ) { }

  async create(dto: BusinessProfilesCreateDto,): Promise<BusinessProfilesEntity> {
    let filePaths: string[];
    const slug = makeSlug(dto.company_name)
    const mapped = ManagerBusinessProfilesMapper.toCreate(dto, filePaths, slug);
    return await this.managerBusinessProfileRepository.save(mapped);
  }

  async update(dto: BusinessProfilesUpdateDto, businessProfileId: number): Promise<BusinessProfilesEntity> {
    const businessProfile = await this.managerBusinessProfileRepository.findOne({ where: { id: businessProfileId } });
    if (!businessProfile) throw new NotFoundException();
    let filePaths: string[];
    const slug = dto.company_name ? makeSlug(dto.company_name) : businessProfile.slug
    const mapped = ManagerBusinessProfilesMapper.toUpdate(dto, businessProfileId, slug, filePaths);
    return await this.managerBusinessProfileRepository.save(mapped);
  }

  async getAll(dto: BusinessProfilesQueryDto) {
    const [entities, total] =
      await this.managerBusinessProfileRepository.findAll(dto);
    const mapped = entities.map((entity) => ManagerBusinessProfilesMapper.toResponseSimple(entity))
    return new PaginationResponse<BusinessProfilesResponseDto>(mapped, total, dto.page, dto.limit)
  }

  async getOne(id: number) {
    const entity = await this.managerBusinessProfileRepository.getOne(id)
    if (!entity) throw new NotFoundException()
    return entity
  }

  async remove(id: number) {
    const result = await this.managerBusinessProfileRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Product with ID ${id} not found`);
    return { message: `Product with ID ${id} successfully deleted` };
  }
}
