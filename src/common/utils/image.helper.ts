import * as fsp from 'fs/promises';
import * as path from 'path';
import * as cheerio from "cheerio";
import axios from "axios";
import * as fs from "fs";

export class ImageHelper {
    static async removeImage(filePath: string) {
        try {
            const absolutePath = path.join(process.cwd(), filePath);

            // Check if the file exists
            await fsp.access(absolutePath)
                .then(async () => {
                    await fsp.unlink(absolutePath);
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
            await fsp.mkdir(outputDir, { recursive: true });

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

    static async deleteImagesFromContent(content: string): Promise<void> {
        const $ = cheerio.load(content);

        const imgElements = $("img");

        for (const img of imgElements.toArray()) {
            const src = $(img).attr("src");
            if (!src) continue;

            // only delete local files (ignore external)
            if (!src.startsWith("/uploads/questions")) continue;

            const filePath = path.join(process.cwd(), src);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }
    static async processImagesFromContent(content: string): Promise<string> {
        const $ = cheerio.load(content);
        const uploadDir = path.join(process.cwd(), "uploads", "questions");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const imgTags = $("img");

        for (const imgElement of imgTags.toArray()) {
            const img = $(imgElement);
            const src = img.attr("src");

            if (!src) continue;

            // ignore if already local
            if (src.startsWith("/uploads")) continue;

            const ext = path.extname(src).split("?")[0] || ".jpg";
            const fileName = `${Date.now()}-${Math.random()}${ext}`;
            const filePath = path.join(uploadDir, fileName);

            const response = await axios.get(src, { responseType: "arraybuffer" });
            fs.writeFileSync(filePath, response.data);

            img.attr("src", `/uploads/questions/${fileName}`);
        }

        return $.html();
    }

    static prependBaseUrl(content: string, baseUrl: string): string {
        const $ = cheerio.load(content);
        $('img').each((_, img) => {
            const src = $(img).attr('src');
            if (src && !src.startsWith('http')) {
                $(img).attr('src', baseUrl + src);
            }
        });
        return $.html();
    }

}
