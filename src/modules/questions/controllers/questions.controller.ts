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
import { QuestionsCreateDto } from '../dtos/create-questions.dto';
import { QuestionsUpdateDto } from '../dtos/update-questions.dto';
import { QuestionsService } from '../services/questions.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from 'src/modules/auth/jwt/optional.jwt-auth.guard';
import { QuestionsQueryDto } from '../dtos/query-questions.dto';
import { PaginationResponse } from 'src/common/dto/pagination.response.dto';
import { QuestionsResponseDto } from '../dtos/response-questions.dto';
import { LangEnum } from 'src/common/enums';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { UsersEntity } from 'src/modules/users/entities/users.entity';

@Controller({ path: 'questions' })
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: QuestionsCreateDto, @CurrentUser() user: UsersEntity, @Headers('lang') lang: LangEnum) {
        return this.questionsService.create(dto, user, lang);
    }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    async findAll(@Query() query: QuestionsQueryDto, @CurrentUser('id') userId?: number): Promise<PaginationResponse<QuestionsResponseDto>> {
        return this.questionsService.getAll(query, userId);
    }

    @Get("my-questions")
    @UseGuards(JwtAuthGuard)
    async myQuestions(@CurrentUser('id') userId: number, @Query() query: PaginationRequestDto) {
        return await this.questionsService.questionsByUserId(userId, query, false)
    }

    @Get("others-questions/:id")
    async othersQuestions(@Param('id', ParseIntPipe) id: number, @Query() query: PaginationRequestDto) {
        return await this.questionsService.questionsByUserId(id, query, true)
    }

    @Get("similar-questions/:id")
    @UseGuards(OptionalJwtAuthGuard)
    async getSimilarQuestions(@Param('id') id: number, @Query() dto: PaginationRequestDto, @CurrentUser('id') userId?: number) {
        return await this.questionsService.getSimilarQuestions(id, dto.limit, dto.page, userId)
    }

    @Get('stats/last-hour-count')
    async getLastHourCount() {
        return this.questionsService.lastHourQuestions();
    }

    @Get('special')
    @UseGuards(OptionalJwtAuthGuard)
    async getSpecialOnes(@CurrentUser('id') userId?: number, @Headers('lang') lang?: LangEnum) {
        return await this.questionsService.getSpecialOnes(userId, lang)
    }

    @Get(':id')
    @UseGuards(OptionalJwtAuthGuard)
    async findOne(@Param('id') id: number, @CurrentUser('id') userId?: number) {
        return this.questionsService.getOne(id, userId);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: QuestionsUpdateDto, @CurrentUser() user: UsersEntity, @Headers('lang') lang: LangEnum) {
        return this.questionsService.update(id, dto, user, lang)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser('id', ParseIntPipe) userId: number) {
        return await this.questionsService.remove(id, userId)
    }
}