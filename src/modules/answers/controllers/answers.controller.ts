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
import { AnswersCreateDto } from '../dtos/create-answers.dto';
import { AnswersUpdateDto } from '../dtos/update-answers.dto';
import { AnswersService } from '../services/answers.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import { OptionalJwtAuthGuard } from 'src/modules/auth/jwt/optional.jwt-auth.guard';

@Controller({ path: 'answers' })
export class AnswersController {
    constructor(private readonly answersService: AnswersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: AnswersCreateDto, @CurrentUser() user: UsersEntity) {
        return this.answersService.create(dto, user);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Query() paginationQuery: PaginationRequestDto, @CurrentUser('id') userId: number) {
        return this.answersService.getAll(paginationQuery, userId, false);
    }

    @Get('question/:questionId')
    @UseGuards(OptionalJwtAuthGuard)
    async getByQuestionId(@Param('questionId', ParseIntPipe) questionId: number, @Query() paginationQuery: PaginationRequestDto, @CurrentUser('id') userId?: number) {
        return this.answersService.getByQuestionId(questionId, paginationQuery, userId);
    }

    @Get('users/:userId')
    async getByUserId(@Param('userId', ParseIntPipe) userId: number, @Query() paginationQuery: PaginationRequestDto) {
        return this.answersService.getAll(paginationQuery, userId, true);
    }

    @Get('stats/last-hour-count')
    async lastHourAnswers() {
        return this.answersService.lastHourAnswers()
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: UsersEntity, @Body() dto: AnswersUpdateDto) {
        return this.answersService.update(dto, id, user)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser('id', ParseIntPipe) userId: number) {
        return await this.answersService.remove(id, userId)
    }
}