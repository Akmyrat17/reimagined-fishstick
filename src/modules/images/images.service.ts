import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from 'bullmq';
import * as fs from 'fs/promises';
import * as path from 'path';


@Injectable()
export class ImagesService {
    constructor(@InjectQueue('image-queue') private readonly imageQueue: Queue) { }
    async upload(files: Express.Multer.File[]) {
        const webpUrls = await this.enqueueImages(files)
        console.log(webpUrls)
    }

    private async enqueueImages(files: Express.Multer.File[]) {
        const imageUrls: string[] = [];
        for (const file of files) {
            const outputDir = path.resolve(`./uploads`);
            await fs.mkdir(outputDir, { recursive: true });
            const parsed = path.parse(file.originalname);
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const finalFilename = `${parsed.name}-${uniqueSuffix}.webp`;
            const publicUrl = `/uploads/${finalFilename}`;
            imageUrls.push(publicUrl);
            const ext = path.parse(file.originalname).ext
            if(ext !== "webp") {
                await this.imageQueue.add('process-image', { buffer: file.buffer, filename: finalFilename, outputDir });
            } else {
                fs.writeFile(publicUrl,file.buffer)
            }
        }
        return imageUrls;
    }
}