import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ImageHelper } from 'src/common/utils/image.helper';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { AnswersCreateDto } from '../dtos/create-answers.dto';
import { AnswersUpdateDto } from '../dtos/update-answers.dto';
import { AnswersResponseDto } from '../dtos/response-answers.dto';
import { AnswersRepository } from '../repositories/answers.repository';
import { AnswersMapper } from '../mappers/answers.mapper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnswersService {
  private readonly baseUrl:string
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly configService:ConfigService
  ) { 
    this.baseUrl = configService.get<string>('APP_URL')
  }

  async create(dto:AnswersCreateDto,userId:number){
    const mapped = AnswersMapper.toCreate(dto,userId)
    const updatedContent =await ImageHelper.processImagesFromContent(dto.content)
    mapped.content = updatedContent
    return await this.answersRepository.save(mapped)
  }

  async update(dto:AnswersUpdateDto,id:number,userId:number){
    const entity = await this.answersRepository.findOne({where:{id,answered_by:{id:userId}}})
    if(!entity) throw new ForbiddenException()
    const mapped = AnswersMapper.toUpdate(dto,id)
    if(dto.content){
      await ImageHelper.deleteImagesFromContent(entity.content)
      const updatedContent =await ImageHelper.processImagesFromContent(dto.content)
      mapped.content = updatedContent
    }
    return await this.answersRepository.save(mapped)
  }

  async getAll(dto: PaginationRequestDto) {
    const [entities, total] =
      await this.answersRepository.findAll(dto);
    const mapped = entities.map((entity) =>{
      const dto = AnswersMapper.toResponseSimple(entity)
      dto.content = ImageHelper.prependBaseUrl(dto.content,this.baseUrl)
      return dto
    })
    return new PaginationResponse<AnswersResponseDto>(mapped, total, dto.page, dto.limit)
  }

  async getOne(id: number) {
    const entity = await this.answersRepository.getOne(id)
    if (!entity) throw new NotFoundException()
    const mapped = AnswersMapper.toResponseSimple(entity)
    mapped.content = ImageHelper.prependBaseUrl(mapped.content,this.baseUrl)
    return mapped
  }

  async remove(id: number,userId:number) {
    const entity = await this.answersRepository.findOne({where:{id,answered_by:{id:userId}}})
    if(!entity) throw new ForbiddenException()
    await ImageHelper.deleteImagesFromContent(entity.content)
    return await this.answersRepository.remove(entity)
  }
}
