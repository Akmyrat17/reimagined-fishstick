import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { AnswersEntity } from '../entites/answers.entity';

@Injectable()
export class ManagerAnswersRepository extends Repository<AnswersEntity> {
    constructor(private dataSource: DataSource) {
        super(AnswersEntity, dataSource.createEntityManager());
    }

    async findAll(dto: PaginationRequestDto) {
        const query = this.createQueryBuilder('answers')
            .leftJoin('answers.answered_by', 'answered_by')
            .leftJoin('answers.answered_to', 'answered_to')
            .select(['answers.id', 'answers.slug', 'answers.file_path', 'answers.check_status'])
            .addSelect(['answered_by.id', 'answered_by.nickname'])
            .addSelect(['answered_to.id', 'answered_to.title', 'answered_to.slug', 'answered_to.file_path', 'answered_to.priority'])
        if (dto.keyword && dto.keyword != '') {
            query.where(`answers.content LIKE :keyword`, { keyword: `%${dto.keyword}%` })
        }
        return await query.take(dto.limit).offset((dto.page - 1) * dto.limit).getManyAndCount()
    }
    
    async getOne(id: number) {
        return await this.createQueryBuilder('answers')
            .leftJoin('answers.answered_to', 'answered_to')
            .select(['answers.id', 'answers.slug', 'answers.file_path', 'answers.check_status'])
            .addSelect(['answered_to.id', 'answered_to.title', 'answered_to.slug', 'answered_to.priority', 'answered_to.content', 'answered_to.file_path'])
            .where('answers.id  = :id', { id })
            .getOne()
    }
}
