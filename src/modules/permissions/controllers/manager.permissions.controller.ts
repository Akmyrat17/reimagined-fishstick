import { Controller, Get, Post } from "@nestjs/common";
import { ManagerPermissionsService } from "../services/manager.permissions.service";

@Controller({ path: "manager/permissions" })
export class ManagerPermissionsController {
    constructor(private readonly managerPermissionsService: ManagerPermissionsService) { }

    @Post()
    async refresh() {
        return await this.managerPermissionsService.refreshPermissions()
    }

    @Get()
    async getAll() {
        return await this.managerPermissionsService.findAll()
    }
}