import { promises as fs } from 'fs';
import * as path from 'path';
export class ImageHelper {
    public static extractImageUrls(htmlContent: string): string[] {
        if (!htmlContent) return [];

        // ✅ Updated regex to match both ' and "
        const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
        const urls: string[] = [];
        let match;

        while ((match = imgRegex.exec(htmlContent)) !== null) {
            urls.push(match[1]);
        }

        return urls;
    }

    public static async deleteImages(imageUrls: string[]): Promise<{ path: string; success: boolean; error?: string }[]> {
        const results = [];
        for (const imageUrl of imageUrls) {
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
            } catch (error) {
                console.error(`Failed to delete ${imageUrl}:`, error.message);
                results.push({ path: imageUrl, success: false, error: error.message });
            }
        }
        return results;
    }
}