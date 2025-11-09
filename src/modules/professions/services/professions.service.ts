import { Injectable } from "@nestjs/common";
import { ProfessionsRepository } from "../repositories/professions.repository";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { LangEnum } from "src/common/enums";
import { ProfessionsMapper } from "../mappers/professions.mapper";
import { PaginationResponse } from "src/common/dto/pagination.response.dto";
import { ProfessionsResponseDto } from "../dtos/response-professions.dto";

@Injectable()
export  class ProfessionsService {
    constructor(private readonly professionsRepository:ProfessionsRepository){}

    async getAll(dto:PaginationRequestDto,lang:LangEnum) {
        const [entites,total] =await this.professionsRepository.getAll(dto,lang)
        const mapped = entites.map(e=>ProfessionsMapper.toResponse(e,lang))
        return new PaginationResponse<ProfessionsResponseDto>(mapped,total,dto.page,dto.limit)
    }
}