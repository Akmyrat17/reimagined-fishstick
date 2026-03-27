import { FeedbacksCreateDto } from "../dtos/create-feedbacks.dto";
import { FeedbacksEntity } from "../entities/feedbacks.entity";

export class FeedbacksMapper {
    public static toCreate(dto: FeedbacksCreateDto) {
        const entity = new FeedbacksEntity()
        entity.content = dto.content
        entity.email = dto.email
        return entity
    }
}