import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ManagerNotificationsService } from "../services/manager.notifications.service";
import { NotificationsCreateDto } from "../dtos/create-notifications.dto";
import { PaginationRequestDto } from "src/common/dto/pagination.request.dto";
import { JwtAuthGuard } from "src/modules/auth/jwt/jwt-auth.guard";
import { AdminGuard } from "src/common/guards/admin.guard";

@Controller({ path: 'manager/notifications' })
@UseGuards(JwtAuthGuard, AdminGuard)
export class ManagerNotificationsController {
    constructor(private readonly managerNotificationsService: ManagerNotificationsService) { }

    @Post()
    async create(@Body() dto: NotificationsCreateDto) {
        return this.managerNotificationsService.createNotifications(dto)
    }

    @Get()
    async getAll(@Query() dto: PaginationRequestDto) {
        return this.managerNotificationsService.getAllNotifications(dto)
    }
}