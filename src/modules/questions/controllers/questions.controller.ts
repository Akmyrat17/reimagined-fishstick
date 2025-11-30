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
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { QuestionsCreateDto } from '../dtos/create-questions.dto';
import { QuestionsUpdateDto } from '../dtos/update-questions.dto';
import { QuestionsService } from '../services/questions.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from 'src/modules/auth/jwt/optional.jwt-auth.guard';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { QuestionsResponseDto } from '../dtos/response-questions.dto';

@Controller({ path: 'questions' })
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto:QuestionsCreateDto,@CurrentUser('id',ParseIntPipe) userId:number) {
        return this.questionsService.create(dto,userId);
    }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    async findAll(
        @Query() query: QuestionsQueryDto,
        @CurrentUser('id') userId?: number
    ): Promise<PaginationResponse<QuestionsResponseDto>> {
        return this.questionsService.getAll(query,userId);
    }

    @Get(':slug')
    @UseGuards(OptionalJwtAuthGuard)
    async findOne(
        @Param('slug') slug: string,
        @CurrentUser('id') userId?: number
    ): Promise<QuestionsResponseDto> {
        return this.questionsService.getOne(slug,userId);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: QuestionsUpdateDto, @CurrentUser('id',ParseIntPipe) userId:number) {
        return this.questionsService.update(id,dto,userId)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number,@CurrentUser('id',ParseIntPipe) userId:number) {
        return await this.questionsService.remove(id,userId)
    }
}