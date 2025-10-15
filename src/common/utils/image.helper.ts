import * as fs from 'fs/promises';
import * as path from 'path';

export class ImageHelper {
    static async removeImage(filePath: string) {
        try {
            const absolutePath = path.join(process.cwd(), filePath);

            // Check if the file exists
            await fs.access(absolutePath)
                .then(async () => {
                    await fs.unlink(absolutePath);
                    console.log(`🗑️ Deleted: ${absolutePath}`);
                })
                .catch(() => {
                    console.warn(`⚠️ File not found: ${absolutePath}`);
                });
        } catch (err: any) {
            console.error(`❌ Error deleting file: ${err.message}`);
        }
    }

    static async prepareUploadPath(subfolder: string, originalName: string, forceWebp = true) {
        try {
            const outputDir = path.resolve(`./uploads/${subfolder}`);
            await fs.mkdir(outputDir, { recursive: true });

            const parsed = path.parse(originalName);
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

            const ext = forceWebp ? '.webp' : parsed.ext; // decide extension
            const finalFilename = `${parsed.name}-${uniqueSuffix}${ext}`;
            const publicUrl = `/uploads/${subfolder}/${finalFilename}`;

            return { outputDir, finalFilename, publicUrl };
        } catch (err: any) {
            console.error(`❌ Error preparing upload path: ${err.message}`);
            throw err;
        }
    }
}
