import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    Query,
    UseInterceptors,
    UploadedFile,
    ParseIntPipe,
    Patch,
    UseGuards,
    Headers
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import * as multer from 'multer';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { HeaderDTO } from 'src/common/dto/header.dto';
import { ManagerQuestionsService } from '../services/manager.questions.service';
import { QuestionsCreateDto } from '../dtos/create-questions.dto';
import { QuestionsUpdateDto } from '../dtos/update-questions.dto';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller({ path: 'manager/questions' })
export class ManagerQuestionsController {
    constructor(private readonly managerQuestionsService: ManagerQuestionsService) { }

    @Post()
    async create(@Body() dto:QuestionsCreateDto) {
        return this.managerQuestionsService.create(dto);
    }

    @Get()
    async findAll(@Query() paginationQuery: QuestionsQueryDto) {
        return this.managerQuestionsService.getAll(paginationQuery);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.managerQuestionsService.getOne(id);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: QuestionsUpdateDto) {
        return this.managerQuestionsService.update(dto,id)
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.managerQuestionsService.remove(id)
    }
}