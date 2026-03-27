import { UsersEntity } from "src/modules/users/entities/users.entity"
import { NotificationsCreateDto } from "../dtos/create-notifications.dto"
import { NotificationsEntity } from "../entities/notifications.entity"
import { NotificationsTypeEnum } from "src/common/enums/notifications-type.enum"

export class ManagerNotificationsMapper {
    public static toCreate(dto: NotificationsCreateDto) {
        const entity = new NotificationsEntity()
        entity.title = dto.title
        entity.body = dto.body
        if (dto.user_id) {
            entity.user = new UsersEntity({ id: dto.user_id })
            entity.type = NotificationsTypeEnum.SPECIFIC
        } else {
            entity.type = NotificationsTypeEnum.ALL
        }
        return entity
    }
}