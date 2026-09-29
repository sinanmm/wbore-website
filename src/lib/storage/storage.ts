import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
  provider: "LOCAL" | "S3" | "WASABI" | "R2";
}

export interface StorageProvider {
  uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
    folder?: string
  ): Promise<UploadResult>;
  deleteFile(key: string): Promise<boolean>;
  getPublicUrl(key: string): string;
}

/**
 * Sanitize filename to prevent directory traversal and remove unsafe characters
 */
export function sanitizeFileName(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, ext)
    .replace(/[^a-zA-Z0-9_\-\.]/g, "_")
    .slice(0, 80);
  const randomSuffix = crypto.randomBytes(6).toString("hex");
  return `${Date.now()}-${base}-${randomSuffix}${ext}`;
}

/**
 * Local Filesystem Storage (Development fallback & local deployment)
 */
export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;
  private publicPrefix: string;

  constructor(
    baseDir: string = path.join(process.cwd(), "public", "uploads", "evidence"),
    publicPrefix: string = "/uploads/evidence"
  ) {
    this.baseDir = baseDir;
    this.publicPrefix = publicPrefix;
    this.ensureDirectory();
  }

  private ensureDirectory() {
    try {
      if (!fs.existsSync(this.baseDir)) {
        fs.mkdirSync(this.baseDir, { recursive: true });
      }
    } catch (err) {
      console.error("Failed to initialize local storage directory:", err);
    }
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
    folder: string = ""
  ): Promise<UploadResult> {
    const safeName = sanitizeFileName(fileName);
    const targetFolder = folder ? path.join(this.baseDir, folder) : this.baseDir;

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const filePath = path.join(targetFolder, safeName);
    await fs.promises.writeFile(filePath, file);

    const relativeKey = folder ? `${folder}/${safeName}` : safeName;
    const url = `${this.publicPrefix}/${relativeKey}`;

    return {
      url,
      key: relativeKey,
      size: file.length,
      mimeType,
      provider: "LOCAL",
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      // Prevent directory traversal
      const safeKey = path.normalize(key).replace(/^(\.\.[\/\\])+/, "");
      const filePath = path.join(this.baseDir, safeKey);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Failed to delete local file ${key}:`, err);
      return false;
    }
  }

  getPublicUrl(key: string): string {
    return `${this.publicPrefix}/${key}`;
  }
}

/**
 * S3-Compatible Object Storage Provider
 * Supports AWS S3, Wasabi, Cloudflare R2
 */
export class S3CompatibleStorageProvider implements StorageProvider {
  private bucket: string;
  private endpoint?: string;
  private region: string;
  private accessKeyId: string;
  private secretAccessKey: string;
  private publicDomain?: string;
  private providerName: "S3" | "WASABI" | "R2";

  constructor(options: {
    bucket: string;
    region?: string;
    endpoint?: string;
    accessKeyId: string;
    secretAccessKey: string;
    publicDomain?: string;
    providerName?: "S3" | "WASABI" | "R2";
  }) {
    this.bucket = options.bucket;
    this.region = options.region || "us-east-1";
    this.endpoint = options.endpoint;
    this.accessKeyId = options.accessKeyId;
    this.secretAccessKey = options.secretAccessKey;
    this.publicDomain = options.publicDomain;
    this.providerName = options.providerName || "S3";
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
    folder: string = "evidence"
  ): Promise<UploadResult> {
    const safeName = sanitizeFileName(fileName);
    const key = folder ? `${folder}/${safeName}` : safeName;

    // Use AWS SDK if available or standard S3 PUT REST request with AWS Signature V4
    // If AWS SDK package is not installed, we fallback to local or signed REST PUT
    try {
      const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
      const client = new S3Client({
        region: this.region,
        endpoint: this.endpoint,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        },
      });

      await client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file,
          ContentType: mimeType,
        })
      );
    } catch {
      // If @aws-sdk/client-s3 is not installed, fallback to local storage
      console.warn(
        "[@aws-sdk/client-s3] not installed. Falling back to LocalStorageProvider."
      );
      const local = new LocalStorageProvider();
      return local.uploadFile(file, fileName, mimeType, folder);
    }

    const url = this.getPublicUrl(key);

    return {
      url,
      key,
      size: file.length,
      mimeType,
      provider: this.providerName,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const { S3Client, DeleteObjectCommand } = await import("@aws-sdk/client-s3");
      const client = new S3Client({
        region: this.region,
        endpoint: this.endpoint,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        },
      });

      await client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return true;
    } catch (err) {
      console.error(`S3 delete failed for key ${key}:`, err);
      return false;
    }
  }

  getPublicUrl(key: string): string {
    if (this.publicDomain) {
      return `${this.publicDomain.replace(/\/$/, "")}/${key}`;
    }
    if (this.endpoint) {
      return `${this.endpoint.replace(/\/$/, "")}/${this.bucket}/${key}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}

/**
 * Storage Provider Factory
 */
export function getStorageProvider(): StorageProvider {
  const provider = (process.env.STORAGE_PROVIDER || "LOCAL").toUpperCase();
  const bucket = process.env.S3_BUCKET || process.env.STORAGE_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

  if (
    (provider === "S3" || provider === "WASABI" || provider === "R2") &&
    bucket &&
    accessKeyId &&
    secretAccessKey
  ) {
    let endpoint = process.env.S3_ENDPOINT;
    if (provider === "WASABI" && !endpoint) {
      endpoint = "https://s3.wasabisys.com";
    }

    return new S3CompatibleStorageProvider({
      bucket,
      region: process.env.S3_REGION || "auto",
      endpoint,
      accessKeyId,
      secretAccessKey,
      publicDomain: process.env.S3_PUBLIC_DOMAIN,
      providerName: provider as "S3" | "WASABI" | "R2",
    });
  }

  // Default fallback for development
  return new LocalStorageProvider();
}

export const storage = getStorageProvider();
export default storage;
