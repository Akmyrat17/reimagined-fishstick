import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuestionsEntity } from '../entities/questions.entity';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';

@Injectable()
export class ManagerQuestionsRepository extends Repository<QuestionsEntity> {
    constructor(private dataSource: DataSource) {
        super(QuestionsEntity, dataSource.createEntityManager());
    }

    async findAll(dto: QuestionsQueryDto): Promise<[QuestionsEntity[], number]> {
        const query = this.createQueryBuilder('questions')
            .leftJoin('questions.asked_by', 'asked_by')
            .select(['questions.id', 'questions.created_at', 'questions.updated_at', 'questions.slug', 'questions.in_review', 'questions.priority', 'questions.special', 'questions.check_status', 'questions.title', 'questions.content'])
            .addSelect(['asked_by.id', 'asked_by.fullname'])
        if (dto.keyword && dto.keyword != '') {
            query.where(`questions.title ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
        }
        if (dto.check_status) query.andWhere("questions.check_status = :value", { value: dto.check_status })
        if (dto.priority) query.andWhere("questions.priority = :value", { value: dto.priority })
        const total = await query.getCount()
        const entities = await query.take(dto.limit).offset((dto.page - 1) * dto.limit).getMany()
        return [entities, total]
    }
    async getOne(id: number) {
        return await this.createQueryBuilder('questions')
            .leftJoin('questions.asked_by', 'asked_by')
            .select(['questions.id', 'questions.slug', 'questions.created_at', 'questions.updated_at', 'questions.priority', 'questions.special', 'questions.check_status', 'questions.title', 'questions.content'])
            .addSelect(['asked_by.id', 'asked_by.fullname'])
            .where('questions.id  = :id', { id })
            .getOne()
    }
}
