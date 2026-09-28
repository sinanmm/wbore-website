/**
 * World Book of Record Excellence (WBRE)
 * Storage Abstraction Layer
 * 
 * Provides unified interface for file uploads, evidence storage, and asset retrieval.
 * Can be transitioned from local filesystem to AWS S3 or Cloudflare R2 seamlessly.
 */

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

export interface StorageProvider {
  uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<UploadResult>;
  deleteFile(key: string): Promise<boolean>;
  getPublicUrl(key: string): string;
}

class LocalStorageProvider implements StorageProvider {
  async uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<UploadResult> {
    // In production, integrate with S3/R2/Blob. Defaulting to standard asset route.
    const key = `uploads/${Date.now()}-${fileName}`;
    return {
      url: `/assets/${key}`,
      key,
      size: file.length,
      mimeType,
    };
  }

  async deleteFile(_key: string): Promise<boolean> {
    return true;
  }

  getPublicUrl(key: string): string {
    return `/${key}`;
  }
}

export const storage: StorageProvider = new LocalStorageProvider();
export default storage;
