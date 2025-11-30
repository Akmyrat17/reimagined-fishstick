import { Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import * as multer from "multer"
import { ImagesService } from "./images.service";
import { FilesInterceptor } from "@nestjs/platform-express";
@Controller({path:"images"})
export class ImagesController {
    constructor (private readonly imagesService:ImagesService){}
    @Post()
    @UseInterceptors(FilesInterceptor('images', 10, { storage: multer.memoryStorage() }))
    async upload(@UploadedFiles() files:Express.Multer.File[]){
        return  await this.imagesService.upload(files)
    }
}