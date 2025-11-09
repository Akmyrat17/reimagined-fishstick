import { Injectable } from "@nestjs/common";
import { TagsRepository } from "../repositories/tags.repository";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { LangEnum } from "src/common/enums";
import { TagsMapper } from "../mappers/tags.mapper";
import { PaginationResponse } from "src/common/dto/pagination.response.dto";
import { TagsResponseDto } from "../dtos/response-tags.dto";

@Injectable()
export  class TagsService {
    constructor(private readonly tagsRepository:TagsRepository){}

    async getAll(dto:PaginationRequestDto,lang:LangEnum) {
        const [entites,total] =await this.tagsRepository.getAll(dto,lang)
        const mapped = entites.map(e=>TagsMapper.toResponse(e,lang))
        return new PaginationResponse<TagsResponseDto>(mapped,total,dto.page,dto.limit)
    }
}