import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { QuestionsEntity } from '../entities/questions.entity';

@Injectable()
export class ManagerQuestionsRepository extends Repository<QuestionsEntity> {
    constructor(private dataSource: DataSource) {
        super(QuestionsEntity, dataSource.createEntityManager());
    }

    async findAll(dto: PaginationRequestDto) {
        const query = this.createQueryBuilder('questions')
            .leftJoin('questions.asked_by','asked_by')
            .select(['questions.id', 'questions.slug', 'questions.file_path','questions.is_approved'])
            .addSelect(['asked_by.id','asked_by.nickname'])
        if (dto.keyword && dto.keyword != '') {
            query.where(`questions.title LIKE :keyword`, { keyword: `%${dto.keyword}%` })
        }
        return await query.take(dto.limit).offset((dto.page - 1) * dto.limit).getManyAndCount()
    }
    async getOne(id: number) {
        return await this.createQueryBuilder('questions')
        .leftJoin('questions.asked_by','asked_by')
        .select(['questions.id','questions.slug','questions.priority','questions.file_path','questions.is_approved','questions.title','questions.content'])
        .addSelect(['asked_by.id','asked_by.fullname','asked_by.nickname','asked_by.role'])
        .where('questions.id  = :id',{id})
        .getOne()
    }
}
