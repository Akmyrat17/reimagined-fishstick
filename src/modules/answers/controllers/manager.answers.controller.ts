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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import * as multer from 'multer';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ManagerAnswersService } from '../services/manager.answers.service';
import { AnswersCreateDto } from '../dtos/create-answers.dto';
import { AnswersUpdateDto } from '../dtos/update-answers.dto';
import { AnswersQueryDto } from '../dtos/query-answers.dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller({ path: 'manager/answers' })
export class ManagerAnswersController {
    constructor(private readonly managerAnswersService: ManagerAnswersService) { }

    @Post()
    async create(@Body() dto:AnswersCreateDto) {
        return this.managerAnswersService.create(dto);
    }

    @Get()
    async findAll(@Query() paginationQuery: AnswersQueryDto) {
        return this.managerAnswersService.getAll(paginationQuery);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.managerAnswersService.getOne(id);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: AnswersUpdateDto) {
        return this.managerAnswersService.update(dto,id)
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.managerAnswersService.remove(id)
    }
}