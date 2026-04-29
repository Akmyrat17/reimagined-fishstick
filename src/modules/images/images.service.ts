import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from 'bullmq';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ImagesUploadDto } from "./upload-images.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ImagesService {
    private readonly baseUrl: string
    constructor(
        @InjectQueue('image-queue') private readonly imageQueue: Queue,
        private readonly configService: ConfigService
    ) {
        this.baseUrl = configService.get<string>('BASE_URL')
    }
    async upload(files: Express.Multer.File[]) {
        return await this.enqueueImages(files);
    }
    async deleteImages(dto: ImagesUploadDto) {
        const results = [];
        const { image_urls } = dto;

        for (const imageUrl of image_urls) {
            try {
                // Handle both full URLs and relative paths
                let filename: string;

                if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                    const parsedUrl = new URL(imageUrl);
                    filename = path.basename(parsedUrl.pathname);
                } else {
                    // It's already a relative path like /uploads/filename.webp
                    filename = path.basename(imageUrl);
                }

                const filePath = path.join(process.cwd(), 'uploads', filename);
                await fs.access(filePath);
                await fs.unlink(filePath);
                results.push({ path: imageUrl, success: true });
            } catch (error: any) {
                console.error(`Failed to delete ${imageUrl}:`, error.message);
                results.push({
                    path: imageUrl,
                    success: false,
                    error: error.message,
                });
            }
        }
        return results;
    }

    private async enqueueImages(files: Express.Multer.File[]) {
        const imageUrls: string[] = [];

        for (const file of files) {
            const outputDir = path.resolve(`./uploads`);
            await fs.mkdir(outputDir, { recursive: true });

            const finalFilename = `${Math.round(Math.random() * 1e9)}.webp`;
            const publicUrl = `/uploads/${finalFilename}`;
            const ext = path.parse(file.originalname).ext;

            if (ext !== ".webp") {
                await this.imageQueue.add('process-image', {
                    buffer: file.buffer,
                    filename: finalFilename,
                    outputDir
                });
            } else {
                const filePath = path.join(outputDir, finalFilename);
                await fs.writeFile(filePath, file.buffer);
            }

            // Return only the relative path without baseUrl
            imageUrls.push(publicUrl);
        }

        return imageUrls;
    }
}