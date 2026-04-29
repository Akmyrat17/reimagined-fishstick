import { promises as fs } from 'fs';
import * as path from 'path';
export class ImageHelper {
    public static extractImageUrls(content: string): string[] {
        if (!content) return [];
        const urls: string[] = [];

        // Format 1: Raw HTML <img src="..." /> or <img src='...'>
        const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
        let match;
        while ((match = imgRegex.exec(content)) !== null) {
            urls.push(match[1]);
        }

        // Format 2: TipTap/ProseMirror JSON {"type":"image","attrs":{"src":"..."}}
        try {
            const parsed = JSON.parse(content);
            const traverse = (node: any) => {
                if (node?.type === 'image' && node?.attrs?.src) {
                    urls.push(node.attrs.src);
                }
                if (node?.content?.length) {
                    node.content.forEach(traverse);
                }
            };
            traverse(parsed);
        } catch {
            // not JSON, already handled by regex above
        }

        return [...new Set(urls)]; // dedupe
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
            } catch (error: any) {
                console.error(`Failed to delete ${imageUrl}:`, error.message);
                results.push({ path: imageUrl, success: false, error: error.message });
            }
        }
        return results;
    }
}