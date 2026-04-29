import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ManagerUsersService } from '../services/manager.users.service';
import { PaginationRequestDto } from 'src/common/dto/pagination.request.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { LangEnum } from 'src/common/enums';
import { SendGmailNotificationDto } from '../dtos/send-gmail-notification.dto';
import { UsersQueryDto } from '../dtos/query-users.dto';

@Controller({ path: 'manager/users' })
@UseGuards(JwtAuthGuard, AdminGuard)
export class ManagerUsersController {
  constructor(private readonly managerUsersService: ManagerUsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.managerUsersService.create(createUserDto);
  }

  @Post('send-notification')
  sendNotification(@Body() dto: SendGmailNotificationDto) {
    return this.managerUsersService.sendNotificationToUser(dto);
  }

  @Get()
  findAll(@Query() paginationDto: UsersQueryDto, @Headers('lang') lang: LangEnum) {
    return this.managerUsersService.findAll(paginationDto, lang);
  }

  @Get('total')
  getTotal() {
    return this.managerUsersService.getTotal();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('lang') lang: LangEnum) {
    return this.managerUsersService.findOne(+id, lang);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.managerUsersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managerUsersService.remove(+id);
  }
}
