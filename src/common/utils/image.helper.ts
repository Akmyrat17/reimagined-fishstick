import * as fsp from 'fs/promises';
import * as path from 'path';
import * as cheerio from "cheerio";
import axios from "axios";
import * as fs from "fs";

function decodeBase64Image(dataString: string) {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return null;
    }
    return {
        type: matches[1],
        data: Buffer.from(matches[2], 'base64'),
        ext: matches[1].split('/')[1] || 'png' // Get file extension (e.g., 'png')
    };
}

// Interface for Tiptap structure (simplified)
interface TiptapNode {
    type: string;
    content?: TiptapNode[];
    attrs?: { [key: string]: any };
}
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
        // 1. Extract the Tiptap JSON string from the bad HTML wrapper
        const match = content.match(/<body>(.*?)<\/body>/);
        if (!match || match.length < 2) {
             // If no body tags, assume content is the raw Tiptap JSON string
             // NOTE: If this assumption is wrong, you need to fix the upstream step
             console.warn("Could not extract content from HTML body. Assuming raw Tiptap JSON.");
        }
        
        const tiptapJsonString = match ? match[1] : content;
        let tiptapDoc: TiptapNode;

        try {
            // 2. Parse the string into a JavaScript object
            tiptapDoc = JSON.parse(tiptapJsonString);
        } catch (e) {
            console.error("❌ Failed to parse Tiptap JSON:", e);
            return content; // Return original content on failure
        }
        
        const uploadDir = path.join(process.cwd(), "uploads", "questions");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // 3. Loop through content nodes to find images
        if (tiptapDoc.content) {
            for (const node of tiptapDoc.content) {
                if (node.type === "image" && node.attrs && node.attrs.src) {
                    const src = node.attrs.src as string;
                    
                    // Check for Base64 data URL
                    if (src.startsWith("data:")) {
                        const imageInfo = decodeBase64Image(src);
                        if (imageInfo) {
                            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${imageInfo.ext}`;
                            const filePath = path.join(uploadDir, fileName);
                            
                            // 4. Save the buffer
                            fs.writeFileSync(filePath, imageInfo.data);
                            
                            // 5. Update the node's src attribute
                            node.attrs.src = `/uploads/questions/${fileName}`;
                            console.log(`✅ Saved base64 image to: ${node.attrs.src}`);
                        }
                    } 
                    // Add logic here to handle external URLs (src starts with 'http'), 
                    // similar to what your original Cheerio code attempted with axios.get
                }
            }
        }
        
        // 6. Return the entire modified Tiptap document structure stringified
        // Note: We are not re-wrapping it in <html> tags. The response payload 
        // suggests the service expects the raw JSON string back.
        return JSON.stringify(tiptapDoc);
    }

   /**
     * Prepend base URL to image sources in Tiptap JSON content
     */
    static prependBaseUrl(content: string, baseUrl: string): string {
        try {
            // Extract Tiptap JSON from HTML wrapper if present
            const match = content.match(/<body>(.*?)<\/body>/);
            const tiptapJsonString = match ? match[1] : content;
            
            let tiptapDoc: TiptapNode;
            try {
                tiptapDoc = JSON.parse(tiptapJsonString);
            } catch (e) {
                console.error("❌ Failed to parse Tiptap JSON in prependBaseUrl:", e);
                return content;
            }

            const processNode = (node: TiptapNode) => {
                if (node.type === "image" && node.attrs && node.attrs.src) {
                    const src = node.attrs.src as string;
                    // Only prepend if it's a relative URL starting with /uploads
                    if (src.startsWith('/uploads/') && !src.startsWith('http')) {
                        node.attrs.src = baseUrl + src;
                    }
                }
                if (node.content) {
                    node.content.forEach(processNode);
                }
            };

            if (tiptapDoc.content) {
                tiptapDoc.content.forEach(processNode);
            }

            return JSON.stringify(tiptapDoc);
        } catch (e) {
            console.error("❌ Failed to prepend base URL:", e);
            return content;
        }
    }

}
