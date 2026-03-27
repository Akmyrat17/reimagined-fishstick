import { Injectable, NotFoundException } from "@nestjs/common";
import { ManagerConstantPagesRepository } from "../repositories/manager.constant-pages.repository";
import { ManagerConstantPagesMapper } from "../mappers/manager.constant-pages.mapper";
import { ConstantPagesCreateDto } from "../dto/create-constant-pages.dto";
import { ConstantPagesUpdateDto } from "../dto/update-constant-pages.dto";

@Injectable()
export class ManagerConstantPagesService {
    constructor(private readonly managerConstantPagesRepository: ManagerConstantPagesRepository) { }

    async create(dto: ConstantPagesCreateDto) {
        const entity = ManagerConstantPagesMapper.toCreate(dto)
        return await this.managerConstantPagesRepository.save(entity)
    }

    async update(id: number, dto: ConstantPagesUpdateDto) {
        const entity = await this.managerConstantPagesRepository.findOne({ where: { id } })
        if (!entity) throw new NotFoundException()
        const mapped = ManagerConstantPagesMapper.toUpdate(dto, id)
        const updatedEntity = await this.managerConstantPagesRepository.save(mapped)
        return updatedEntity
    }

    async getAll() {
        return await this.managerConstantPagesRepository.find()
    }

    async delete(id: number) {
        const entity = await this.managerConstantPagesRepository.findOne({ where: { id } })
        if (!entity) throw new NotFoundException()
        return await this.managerConstantPagesRepository.remove(entity)
    }
}