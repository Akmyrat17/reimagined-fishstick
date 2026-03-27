import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BusinessProfilesRepository } from "../repositories/business-profiles.repository";
import { BusinessProfilesCreateDto } from "../dtos/create-business-profiles.dto";
import { BusinessProfilesEntity } from "../entities/business-profiles.entity";
import { BusinessProfilesMapper } from "../mappers/business-profiles.mapper";
import { BusinessProfilesUpdateDto } from "../dtos/update-business-profiles.dto";
import { LangEnum } from "src/common/enums";

@Injectable()
export class BusinessProfilesService {
    constructor(private readonly businessProfilesRepository: BusinessProfilesRepository) { }

    async create(dto: BusinessProfilesCreateDto, userId: number): Promise<BusinessProfilesEntity> {
        const mapped = BusinessProfilesMapper.toCreate(dto, userId);
        return await this.businessProfilesRepository.save(mapped);
    }

    async update(dto: BusinessProfilesUpdateDto, id: number): Promise<BusinessProfilesEntity> {
        const businessProfile = await this.businessProfilesRepository.findOne({ where: { id } });
        if (!businessProfile) throw new NotFoundException();
        const mapped = BusinessProfilesMapper.toUpdate(dto, id);
        return await this.businessProfilesRepository.save(mapped);
    }

    async getMyBusinessProfiles(userId: number, lang: LangEnum) {
        const businessProfiles = await this.businessProfilesRepository.getMine(userId, lang);
        const mapped = businessProfiles.map(businessProfile => BusinessProfilesMapper.toResponse(businessProfile, lang));
        return mapped
    }

    async getBusinessProfilesById(id: number, lang: LangEnum, userId: number) {
        try {
            const businessProfiles = await this.businessProfilesRepository.getOne(id, lang, userId);
            const mapped = BusinessProfilesMapper.toResponse(businessProfiles, lang);
            return mapped

        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.detail || error.message);
        }
    }
}