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
import { QuestionsCreateDto } from '../dtos/create-questions.dto';
import { QuestionsUpdateDto } from '../dtos/update-questions.dto';
import { QuestionsService } from '../services/questions.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller({ path: 'questions' })
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image', { storage: multer.memoryStorage() }))
    async create(@Body() dto:QuestionsCreateDto, @UploadedFile() file?: Express.Multer.File,@CurrentUser('id',ParseIntPipe) userId:number) {
        return this.questionsService.create(dto,userId, file);
    }

    @Get()
    async findAll(@Query() paginationQuery: PaginationRequestDto) {
        return this.questionsService.getAll(paginationQuery);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.questionsService.getOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image', { storage: multer.memoryStorage() }))
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: QuestionsUpdateDto, @CurrentUser('id',ParseIntPipe) userId:number,@UploadedFile() file?: Express.Multer.File) {
        return this.questionsService.update(dto,id,userId,file)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number,@CurrentUser('id',ParseIntPipe) userId:number) {
        return await this.questionsService.remove(id,userId)
    }
}