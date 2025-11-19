import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuestionsEntity } from '../entities/questions.entity';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';

@Injectable()
export class ManagerQuestionsRepository extends Repository<QuestionsEntity> {
    constructor(private dataSource: DataSource) {
        super(QuestionsEntity, dataSource.createEntityManager());
    }

    async findAll(dto: QuestionsQueryDto) {
        const query = this.createQueryBuilder('questions')
            .leftJoin('questions.asked_by','asked_by')
            .select(['questions.id', 'questions.slug', 'questions.priority','questions.special','questions.check_status','questions.title','questions.content'])
            .addSelect(['asked_by.id','asked_by.fullname'])
        if (dto.keyword && dto.keyword != '') {
            query.where(`questions.title ILIKE :keyword`, { keyword: `%${dto.keyword}%` })
        }
        if(dto.check_status) query.andWhere("questions.check_status = :value",{value:dto.check_status})
        if(dto.priority) query.andWhere("questions.priority = :value",{value:dto.priority})
        return await query.take(dto.limit).offset((dto.page - 1) * dto.limit).getManyAndCount()
    }
    async getOne(id: number) {
        return await this.createQueryBuilder('questions')
        .leftJoin('questions.asked_by','asked_by')
        .select(['questions.id','questions.slug','questions.priority','questions.special','questions.check_status','questions.title','questions.content'])
        .addSelect(['asked_by.id','asked_by.fullname'])
        .where('questions.id  = :id',{id})
        .getOne()
    }
}
