import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { AddressesEntity } from "../entities/addresses.entity";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";

@Injectable()
export class AddressesRepository extends Repository<AddressesEntity> {
    constructor(private readonly dataSource: DataSource) { super(AddressesEntity, dataSource.createEntityManager()); }

    async getAll(dto: PaginationRequestDto): Promise<[AddressesEntity[], number]> {
        const { page, limit, keyword } = dto;
        const offset = (page - 1) * limit;

        const query = this.createQueryBuilder('addresses');

        if (keyword) {
            query.andWhere(
                new Brackets(qb => {
                    qb.where(`addresses.province ILIKE :keyword`, { keyword: `%${keyword}%` })
                        .orWhere(`addresses.district ILIKE :keyword`, { keyword: `%${keyword}%` })
                        .orWhere(`addresses.city ILIKE :keyword`, { keyword: `%${keyword}%` })
                })
            )
        }

        const total = await query.getCount();
        const data = await query
            .take(limit)
            .skip(offset)
            .getMany();

        return [data, total];
    }
}