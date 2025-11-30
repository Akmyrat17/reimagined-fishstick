import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    Query,
    ParseIntPipe,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ManagerBusinessProfilesService } from '../services/manager.business-profiles.service';
import { BusinessProfilesCreateDto } from '../dtos/create-business-profiles.dto';
import { BusinessProfilesQueryDto } from '../dtos/query-business-profiles.dto';
import { BusinessProfilesUpdateDto } from '../dtos/update-business-profiles.dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller({ path: 'manager/clients' })
export class ManagerBusinessProfileController {
    constructor(private readonly managerBusinessProfileService: ManagerBusinessProfilesService) { }
    @Post()
    async create(@Body() dto:BusinessProfilesCreateDto) {
        return this.managerBusinessProfileService.create(dto);
    }

    @Get()
    async findAll(@Query() paginationQuery: BusinessProfilesQueryDto) {
        return this.managerBusinessProfileService.getAll(paginationQuery);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.managerBusinessProfileService.getOne(id);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: BusinessProfilesUpdateDto) {
        return this.managerBusinessProfileService.update(dto,id)
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.managerBusinessProfileService.remove(id)
    }
}