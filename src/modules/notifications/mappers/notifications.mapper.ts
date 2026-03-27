import { NotificationsResponseDto } from "../dtos/response-notifications.dto";
import { NotificationsEntity } from "../entities/notifications.entity";

export class NotificationsMapper {
    public static toResponseSimple(entity: NotificationsEntity) {
        const dto = new NotificationsResponseDto()
        dto.id = entity.id
        dto.title = entity.title
        dto.body = entity.body
        dto.created_at = entity.created_at
        return dto
    }
}