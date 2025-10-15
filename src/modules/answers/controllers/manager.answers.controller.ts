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

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller({ path: 'manager/answers' })
export class ManagerAnswersController {
    constructor(private readonly managerAnswersService: ManagerAnswersService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image', { storage: multer.memoryStorage() }))
    async create(@Body() dto:AnswersCreateDto, @UploadedFile() file?: Express.Multer.File) {
        return this.managerAnswersService.create(dto, file);
    }

    @Get()
    async findAll(@Query() paginationQuery: PaginationRequestDto) {
        return this.managerAnswersService.getAll(paginationQuery);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.managerAnswersService.getOne(id);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image', { storage: multer.memoryStorage() }))
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: AnswersUpdateDto, @UploadedFile() file?: Express.Multer.File) {
        return this.managerAnswersService.update(dto,id,file)
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.managerAnswersService.remove(id)
    }
}