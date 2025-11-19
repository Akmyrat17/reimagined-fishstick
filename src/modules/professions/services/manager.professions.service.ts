import { Injectable, NotFoundException } from "@nestjs/common";
import { ManagerProfessionsRepository } from "../repositories/manager.professions.repository";
import { ProfessionsCreateDto } from "../dtos/create-professions.dto";
import { ManagerProfessionsMapper } from "../mappers/manager.professions.mapper";
import { ProfessionsUpdateDto } from "../dtos/update-professions.dto";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { PaginationResponse } from "src/common/dto/pagination.response.dto";
import { LangEnum } from "src/common/enums";
import { ProfessionsResponseDto } from "../dtos/response-professions.dto";

@Injectable()
export class ManagerProfessionsService {
    constructor(private readonly managerProfessionsRepository:ManagerProfessionsRepository){}


    async create(dto:ProfessionsCreateDto) {
        const mapped = ManagerProfessionsMapper.toCreate(dto)
        return await this.managerProfessionsRepository.save(mapped)
    }

    async update(dto:ProfessionsUpdateDto,id:number){
        const mapped = ManagerProfessionsMapper.toUpdate(dto,id)
        return await this.managerProfessionsRepository.save(mapped)
    }

    async getAll(dto:PaginationRequestDto,lang:LangEnum) {
        const [entities,total] =await this.managerProfessionsRepository.getAll(dto,lang)
        const mapped = entities.map(e=>ManagerProfessionsMapper.toResponse(e))
        return new PaginationResponse<ProfessionsResponseDto>(mapped,total,dto.page,dto.limit)
    }

    async delete (id:number) {
        const entity = await this.managerProfessionsRepository.findOne({where:{id}})
        if(!entity) throw new NotFoundException("Profession not found")
        return await this.managerProfessionsRepository.remove(entity)
    }

    // async getOne (id:number) {
    //     const entity = await this.managerProfessionsRepository.findOneBy({id})
    //     if(!entity) throw new NotFoundException()
    //     return entity
    // }
}