import { Injectable } from "@nestjs/common";
import { FeedbacksCreateDto } from "../dtos/create-feedbacks.dto";
import { FeedbacksMapper } from "../mappers/feedbacks.mapper";
import { FeedbacksRepository } from "../repositories/feedbacks.repository";

@Injectable()
export class FeedbacksService {
    constructor(private readonly feedbacksRepository: FeedbacksRepository) { }

    async create(dto: FeedbacksCreateDto) {
        const mapped = FeedbacksMapper.toCreate(dto);
        return await this.feedbacksRepository.save(mapped);
    }
}