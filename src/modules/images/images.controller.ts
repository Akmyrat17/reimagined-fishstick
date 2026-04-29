import { BadRequestException, Body, Controller, Delete, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import * as multer from "multer"
import { ImagesService } from "./images.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ImagesUploadDto } from "./upload-images.dto";
import { fromBuffer } from "file-type";

@Controller({ path: "images" })
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) { }
    @Post()
    @UseInterceptors(FilesInterceptor('images', 10, { storage: multer.memoryStorage() }))
    async upload(@UploadedFiles() files: Express.Multer.File[]) {
        await this.validateFileTypes(files);
        return await this.imagesService.upload(files)
    }

    @Delete()
    async remove(@Body() dto: ImagesUploadDto) {
        return await this.imagesService.deleteImages(dto)
    }

    private async validateFileTypes(files: Express.Multer.File[]) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        for (const file of files) {
            const type = await fromBuffer(file.buffer);

            if (!type || !allowedTypes.includes(type.mime)) {
                throw new BadRequestException(
                    `Invalid file type${file.originalname ? ` for file "${file.originalname}"` : ''}. Allowed: jpeg, png, gif, webp`
                );
            }
        }
    }
}