import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { NotificcationsService } from "../services/notifications.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { OptionalJwtAuthGuard } from "src/modules/auth/jwt/optional.jwt-auth.guard";

@Controller({ path: "notifications" })
@UseGuards(OptionalJwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificcationsService) { }

    @Get()
    getNotifications(@CurrentUser("id") userId: number) {
        return this.notificationsService.getNotifications(userId)
    }

    @Delete(":id")
    removeNotification(@CurrentUser("id") userId: number, @Param("id", ParseIntPipe) notificationId: number) {
        return this.notificationsService.removeNotification(userId, notificationId)
    }
}