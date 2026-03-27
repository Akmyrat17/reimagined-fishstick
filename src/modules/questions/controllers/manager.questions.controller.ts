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
    Headers,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ManagerQuestionsService } from '../services/manager.questions.service';
import { QuestionsCreateDto } from '../dtos/create-questions.dto';
import { QuestionsUpdateDto } from '../dtos/update-questions.dto';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';
import { LangEnum } from 'src/common/enums';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'manager/questions' })
export class ManagerQuestionsController {
    constructor(private readonly managerQuestionsService: ManagerQuestionsService) { }

    @Post()
    async create(@Body() dto: QuestionsCreateDto, @CurrentUser() user: UsersEntity) {
        return this.managerQuestionsService.create(dto, user.role);
    }

    @Get()
    @Permissions('questions.get-all')
    async findAll(@Query() paginationQuery: QuestionsQueryDto, @Headers('lang') lang: LangEnum) {
        return this.managerQuestionsService.getAll(paginationQuery, lang);
    }

    @Get(':id')
    @Permissions('questions.get-one')
    async findOne(@Param('id', ParseIntPipe) id: number, @Headers('lang') lang: LangEnum) {
        return this.managerQuestionsService.getOne(id, lang);
    }

    @Patch(':id')
    @Permissions('questions.update')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: QuestionsUpdateDto) {
        return this.managerQuestionsService.update(dto, id)
    }

    @Patch('in-review/:id')
    @Permissions('questions.update')
    async setInReviewFalse(@Param('id', ParseIntPipe) id: number) {
        return await this.managerQuestionsService.toggleInReviewFalse(id)
    }

    @Delete(':id')
    @Permissions('questions.delete')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.managerQuestionsService.remove(id)
    }
}