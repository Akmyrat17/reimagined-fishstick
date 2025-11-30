import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as path from 'path';
import { promises as fs } from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileTypeFromBuffer } from 'file-type';

const execFileAsync = promisify(execFile);

// Minimum file size to process (1KB)
const MIN_FILE_SIZE = 1024;
// Maximum file size to process (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// Supported MIME types
const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Check if file is a valid image
async function isValidImage(buffer: Buffer): Promise<boolean> {
    try {
        const type = await fileTypeFromBuffer(buffer);
        return type && SUPPORTED_TYPES.includes(type.mime);
    } catch {
        return false;
    }
}

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

        // Validate file size
        if (buffer.length < MIN_FILE_SIZE) {
            console.warn("Skipping conversion, file too small:", filename);
            return { originalPath: null, error: 'File too small' };
        }

        if (buffer.length > MAX_FILE_SIZE) {
            console.warn("Skipping conversion, file too large:", filename);
            return { originalPath: null, error: 'File too large' };
        }

        // Validate file type
        const isValid = await isValidImage(buffer);
        if (!isValid) {
            console.warn("Skipping conversion, invalid or unsupported image format:", filename);
            return { originalPath: null, error: 'Invalid or unsupported image format' };
        }
            
        // Create output folder if not exists
        await fs.mkdir(outputDir, { recursive: true });
            
        // Temp file for conversion
        const tempPath = path.join(outputDir, `temp-${Date.now()}-${filename}`);
        const finalWebpPath = path.join(outputDir, filename.replace(/\.[^.]+$/, '.webp'));

        try {
            await fs.writeFile(tempPath, buffer);

            const cmd = await detectMagickCommand();
            console.log(`🟡 Converting image: ${tempPath} → ${finalWebpPath}`);

            // Run ImageMagick with timeout
            try {
                await Promise.race([
                    execFileAsync(cmd, [
                        tempPath,
                        '-quality',
                        '80',
                        finalWebpPath,
                    ]),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Conversion timed out')), 30000)
                    )
                ]);

                console.log(`✅ Image converted successfully: ${finalWebpPath}`);
                return { webpPath: finalWebpPath, originalPath: tempPath };
            } catch (err: any) {
                console.error(`❌ Failed to convert ${filename}:`, err.message);
                
                // If conversion fails, return the original file path if it exists
                try {
                    const stats = await fs.stat(tempPath);
                    if (stats.isFile()) {
                        console.warn(`⚠️  Returning original file due to conversion error`);
                        return { 
                            originalPath: tempPath, 
                            webpPath: null, 
                            error: `Conversion failed: ${err.message}` 
                        };
                    }
                } catch (statErr) {
                    // Ignore stat errors
                }
                
                throw new Error(`Failed to process image: ${err.message}`);
            } finally {
                // Clean up temp file if conversion was successful
                try {
                    await fs.unlink(tempPath).catch(() => {});
                } catch {}
            }
        } catch (error) {
            console.error('Error in image processing:', error);
            throw error;
        }
    }
}
