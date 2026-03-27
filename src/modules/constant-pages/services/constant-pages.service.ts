import { Injectable, NotFoundException } from "@nestjs/common";
import { ConstantPagesRepository } from "../repositories/constant-pages.repository";
import { ConstantPagesTypeEnum } from "src/common/enums/constant-pages.enum";

@Injectable()
export class ConstantPagesService {
    constructor(private readonly constantPagesRepository: ConstantPagesRepository) { }

    async getOneByType(type: ConstantPagesTypeEnum) {
        const entity = await this.constantPagesRepository.findOneBy({ type });
        if (!entity) throw new NotFoundException("Constant page not found");
        return entity
    }
}