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
    async process(job: Job<{ buffer: Buffer; filename: string; outputDir: string }>) {
        const { buffer: rawBuffer, filename, outputDir } = job.data;

        // Ensure proper Buffer
        const buffer = Buffer.isBuffer(rawBuffer)
            ? rawBuffer
            : Buffer.from((rawBuffer as any).data);

        // Create output folder if not exists
        await fs.mkdir(outputDir, { recursive: true });

        // Temp file for conversion
        const tempPath = path.join(outputDir, `temp-${Date.now()}-${filename}`);
        await fs.writeFile(tempPath, buffer);

        // Final file path
        const finalWebpPath = path.join(outputDir, filename.replace(/\.[^.]+$/, '.webp'));

        try {
            const cmd = await detectMagickCommand();
            console.log(`🟡 Converting image: ${tempPath} → ${finalWebpPath}`);

            // Run ImageMagick
            await execFileAsync(cmd, [
                tempPath,
                '-quality',
                '80',
                finalWebpPath,
            ]);

            console.log(`✅ Image converted successfully: ${finalWebpPath}`);
        } catch (err: any) {
            console.error(`❌ Failed to convert ${filename}:`, err.message);
            throw err;
        } finally {
            // Clean up temp file
            try {
                await fs.unlink(tempPath);
            } catch { }
        }

        return { webpPath: finalWebpPath };
    }
}
