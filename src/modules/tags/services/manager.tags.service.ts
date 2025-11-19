import { Injectable, NotFoundException } from "@nestjs/common";
import { ManagerTagsRepository } from "../repositories/manager.tags.repository";
import { TagsCreateDto } from "../dtos/create-tags.dto";
import { ManagerTagsMapper } from "../mappers/manager.tags.mapper";
import { TagsUpdateDto } from "../dtos/update-tags.dto";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { PaginationResponse } from "src/common/dto/pagination.response.dto";
import { TagsEntity } from "../entities/tags.entity";
import { LangEnum } from "src/common/enums";
import { TagsResponseDto } from "../dtos/response-tags.dto";

@Injectable()
export class ManagerTagsService {
    constructor(private readonly managerTagsRepository:ManagerTagsRepository){}


    async create(dto:TagsCreateDto) {
        const mapped = ManagerTagsMapper.toCreate(dto)
        return await this.managerTagsRepository.save(mapped)
    }

    async update(dto:TagsUpdateDto,id:number){
        const mapped = ManagerTagsMapper.toUpdate(dto,id)
        return await this.managerTagsRepository.save(mapped)
    }

    async getAll(dto:PaginationRequestDto,lang:LangEnum) {
        const [entities,total] =await this.managerTagsRepository.getAll(dto,lang)
        const mapped = entities.map(e=>ManagerTagsMapper.toResponse(e))
        return new PaginationResponse<TagsResponseDto>(mapped,total,dto.page,dto.limit)
    }

    async delete(id:number){
        try {
            const entity = await this.managerTagsRepository.findOne({where:{id}})
        if(!entity) throw new NotFoundException("Tag not found")
        return await this.managerTagsRepository.remove(entity)

        } catch (error) {
            console.log(error)
            
        }    }
    // async getOne (id:number) {
    //     const entity = await this.managerTagsRepository.findOneBy({id})
    //     if(!entity) throw new NotFoundException()
    //     return entity
    // }
}