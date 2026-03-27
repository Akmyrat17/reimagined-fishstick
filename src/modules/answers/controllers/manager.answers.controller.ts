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
import { ManagerAnswersService } from '../services/manager.answers.service';
import { AnswersCreateDto } from '../dtos/create-answers.dto';
import { AnswersUpdateDto } from '../dtos/update-answers.dto';
import { AnswersQueryDto } from '../dtos/query-answers.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UsersEntity } from 'src/modules/users/entities/users.entity';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'manager/answers' })
export class ManagerAnswersController {
    constructor(private readonly managerAnswersService: ManagerAnswersService) { }

    @Post()
    async create(@Body() dto: AnswersCreateDto, @CurrentUser() user: UsersEntity) {
        return this.managerAnswersService.create(dto, user);
    }

    @Get()
    @Permissions('answers.get-all')
    async findAll(@Query() paginationQuery: AnswersQueryDto) {
        return this.managerAnswersService.getAll(paginationQuery);
    }

    @Patch(':id')
    @Permissions('answers.update')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: AnswersUpdateDto) {
        return this.managerAnswersService.update(dto, id)
    }

    @Delete(':id')
    @Permissions('answers.delete')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.managerAnswersService.remove(id)
    }
}
