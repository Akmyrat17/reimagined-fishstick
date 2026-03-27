import { ConstantPagesCreateDto } from "../dto/create-constant-pages.dto"
import { ConstantPagesUpdateDto } from "../dto/update-constant-pages.dto"
import { ConstantPagesEntity } from "../entities/constant-pages.entity"

export class ManagerConstantPagesMapper {
    public static toCreate(dto: ConstantPagesCreateDto) {
        const entity = new ConstantPagesEntity()
        entity.body = dto.body
        entity.type = dto.type
        return entity
    }

    public static toUpdate(dto: ConstantPagesUpdateDto, id: number) {
        const entity = new ConstantPagesEntity({ id })
        if (dto.body) entity.body = dto.body
        if (dto.type) entity.type = dto.type
        return entity
    }
}