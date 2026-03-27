import { Controller, Get, Param, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ManagerFeedbacksService } from '../services/manager.feedbacks.service';
import { FeedbacksReplyDto } from '../dtos/reply-feedbacks.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller({ path: 'manager/feedbacks' })
@UseGuards(JwtAuthGuard, AdminGuard)
export class ManagerFeedbacksController {
  constructor(
    private readonly managerFeedbacksService: ManagerFeedbacksService,
  ) { }

  @Post(':id')
  async reply(@Param('id') id: number, @Body() dto: FeedbacksReplyDto) {
    return await this.managerFeedbacksService.reply(dto, id);
  }

  @Get()
  async getAll(@Query() dto: PaginationRequestDto) {
    return await this.managerFeedbacksService.getAll(dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return await this.managerFeedbacksService.getOne(id);
  }
}
