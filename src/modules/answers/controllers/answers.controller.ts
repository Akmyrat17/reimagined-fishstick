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
import { AnswersCreateDto } from '../dtos/create-answers.dto';
import { AnswersUpdateDto } from '../dtos/update-answers.dto';
import { AnswersService } from '../services/answers.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller({ path: 'answers' })
export class AnswersController {
    constructor(private readonly answersService: AnswersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: AnswersCreateDto, @CurrentUser('id', ParseIntPipe) userId: number) {
        return this.answersService.create(dto, userId);
    }

    @Get()
    async findAll(@Query() paginationQuery: PaginationRequestDto) {
        return this.answersService.getAll(paginationQuery);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.answersService.getOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: number, @CurrentUser('id', ParseIntPipe) userId: number, @Body() dto: AnswersUpdateDto) {
        return this.answersService.update(dto, id, userId)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser('id', ParseIntPipe) userId: number) {
        return await this.answersService.remove(id, userId)
    }
}