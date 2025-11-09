import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { AnswersEntity } from '../entites/answers.entity';
import { AnswersQueryDto } from '../dtos/query-answers.dto';

@Injectable()
export class ManagerAnswersRepository extends Repository<AnswersEntity> {
    constructor(private dataSource: DataSource) {
        super(AnswersEntity, dataSource.createEntityManager());
    }

    async findAll(dto: AnswersQueryDto) {
        const query = this.createQueryBuilder('answers')
            .leftJoin('answers.answered_by', 'answered_by')
            .leftJoin('answers.answered_to', 'answered_to')
            .select(['answers.id', 'answers.slug', 'answers.content', 'answers.check_status'])
            .addSelect(['answered_by.id', 'answered_by.fullname'])
            .addSelect(['answered_to.id', 'answered_to.title', 'answered_to.slug', 'answered_to.priority'])
        if (dto.keyword && dto.keyword != '') {
            query.where(`answers.content LIKE :keyword`, { keyword: `%${dto.keyword}%` })
        }
        if (dto.check_status) query.andWhere("questions.check_status = :value", { value: dto.check_status })
        if (dto.priority) query.andWhere("questions.priority = :value", { value: dto.priority })
        return await query.take(dto.limit).offset((dto.page - 1) * dto.limit).getManyAndCount()
    }

    async getOne(id: number) {
        return await this.createQueryBuilder('answers')
            .leftJoin('answers.answered_to', 'answered_to')
            .select(['answers.id', 'answers.slug', 'answers.content', 'answers.check_status'])
            .addSelect(['answered_to.id', 'answered_to.title', 'answered_to.slug', 'answered_to.priority'])
            .where('answers.id  = :id', { id })
            .getOne()
    }
}
