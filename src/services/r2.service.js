import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import r2Client, { R2_BUCKET, R2_PUBLIC_URL } from "../config/r2.js";

export { R2_PUBLIC_URL };

/**
 * Uploads a file to Cloudflare R2
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export const uploadFile = async (file) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    //console.log(fileName)
    //console.log(fileExtension)
    const command = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=86400', // CDN caching
    });

    await r2Client.send(command);

    // If we have a public URL configured, return that
    if (R2_PUBLIC_URL) {
        return `${R2_PUBLIC_URL}/${fileName}`;
    }

    // Otherwise return the key
    return fileName;
};

/**
 * Deletes a file from Cloudflare R2
 * @param {string} fileUrl - The URL of the file to delete
 */
export const deleteFile = async (fileUrl) => {
    if (!fileUrl) return;

    // Extract key from URL
    // Assumes URL format: https://<domain>/<key>
    const key = fileUrl.split('/').pop();

    const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
    });

    try {
        await r2Client.send(command);
    } catch (error) {
        console.error("Error deleting file from R2:", error);
        // We don't throw here to avoid blocking the DB deletion if R2 fails, 
        // or maybe we should? "Then delete the MongoDB document". 
        // Usually better to fail loudly or log. I'll log.
    }
};

/**
 * Generates a signed GET URL for a file
 * @param {string} fileUrl - Stored URL or Key
 * @returns {Promise<string>} - Signed URL
 */
export const getSignedFileUrl = async (fileUrl) => {
    if (!fileUrl) return null;

    const key = fileUrl.split('/').pop();

    const command = new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
    });

    // Expires in 1 hour
    return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
};
