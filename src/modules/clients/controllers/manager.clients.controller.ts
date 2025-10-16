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
import {  FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ManagerClientsService } from '../services/manager.clients.service';
import { ClientsCreateDto } from '../dtos/create-clients.dto';
import { ClientsQueryDto } from '../dtos/query-clients.dto';
import { ClientsUpdateDto } from '../dtos/update-clients.dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller({ path: 'manager/questions' })
export class ManagerClientsController {
    constructor(private readonly managerClientsService: ManagerClientsService) { }
    @Post()
    @UseInterceptors(FilesInterceptor('image',10, { storage: multer.memoryStorage() }))
    async create(@Body() dto:ClientsCreateDto, @UploadedFile() file?: Express.Multer.File) {
        return this.managerClientsService.create(dto, file);
    }

    @Get()
    async findAll(@Query() paginationQuery: ClientsQueryDto) {
        return this.managerClientsService.getAll(paginationQuery);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.managerClientsService.getOne(id);
    }

    @Patch(':id')
    @UseInterceptors(FilesInterceptor('image',10, { storage: multer.memoryStorage() }))
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: ClientsUpdateDto, @UploadedFile() file?: Express.Multer.File) {
        return this.managerClientsService.update(dto,id,file)
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.managerClientsService.remove(id)
    }
}