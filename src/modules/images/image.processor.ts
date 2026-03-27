import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as path from 'path';
import { promises as fs } from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

let imageMagickCmd: string | null = null;

// Lazy detect which command exists (magick/convert)
async function detectMagickCommand() {
    if (imageMagickCmd) return imageMagickCmd;

    try {
        await execFileAsync('magick', ['-version']);
        imageMagickCmd = 'magick';
    } catch {
        try {
            await execFileAsync('convert', ['-version']);
            imageMagickCmd = 'convert';
        } catch {
            throw new Error('Neither `magick` nor `convert` command found. Install ImageMagick.');
        }
    }
    return imageMagickCmd;
}
@Processor('image-queue')
export class ImageConsumer extends WorkerHost {
    async process(job: Job<{
        buffer: Buffer;
        filename: string;
        outputDir: string;
        quality?: number;      // Optional: default 80
        maxWidth?: number;     // Optional: default 1920
        maxHeight?: number;    // Optional: default 1080
    }>) {
        const {
            buffer: rawBuffer,
            filename,
            outputDir,
            quality = 80,        // ← Default quality
            maxWidth = 1920,     // ← Default max width
            maxHeight = 1080,    // ← Default max height
        } = job.data;

        const buffer = Buffer.isBuffer(rawBuffer)
            ? rawBuffer
            : Buffer.from((rawBuffer as any).data);

        await fs.mkdir(outputDir, { recursive: true });

        const tempPath = path.join(outputDir, `temp-${Date.now()}-${filename}`);
        await fs.writeFile(tempPath, buffer);

        const finalWebpPath = path.join(outputDir, filename.replace(/\.[^.]+$/, '.webp'));

        try {
            const cmd = await detectMagickCommand();

            // Get original file size for logging
            const originalSize = buffer.length;
            console.log(`🟡 Converting: ${filename} (${(originalSize / 1024 / 1024).toFixed(2)}MB)`);

            await execFileAsync(cmd, [
                tempPath,
                '-quality', String(quality),           // ← Compression quality
                '-resize', `${maxWidth}x${maxHeight}>`, // ← Resize if larger (> means only shrink)
                '-strip',                               // ← Remove EXIF/metadata
                '-define', 'webp:method=6',             // ← Best WebP compression
                '-define', 'webp:lossless=false',       // ← Lossy = smaller files
                finalWebpPath,
            ]);


        } catch (err: any) {
            console.error(`❌ Failed to convert ${filename}:`, err.message);
            throw err;
        } finally {
            try {
                await fs.unlink(tempPath);
            } catch { }
        }

        return { webpPath: finalWebpPath };
    }
}