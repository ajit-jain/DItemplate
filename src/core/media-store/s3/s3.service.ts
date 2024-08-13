import { Injectable } from '@nestjs/common';
import { ImageStoreFacade } from 'core/media-store/image-store.facade';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config as envConfig } from 'dotenv';
import { IMAGE_EXPIRATION_TIME } from 'core/media-store/constants/media-store.constants';
envConfig();

@Injectable()
export class S3Service implements ImageStoreFacade {
  private readonly s3Client: S3Client;
  private readonly imageBucketName: string;
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
    });
    this.imageBucketName = process.env.AWS_IMAGE_BUCKET_NAME!;
  }

  async uploadImage(
    imageName: string,
    image: Express.Multer.File,
  ): Promise<string> {
    const putObjectCommand: PutObjectCommand = new PutObjectCommand({
      Bucket: this.imageBucketName,
      Key: imageName,
      Body: image.buffer,
    });

    await this.s3Client.send(putObjectCommand);
    return this.getSignedUrl(imageName, this.imageBucketName);
  }
  async getImageUrl(imageName: string) {
    return this.getSignedUrl(imageName, this.imageBucketName);
  }
  private getSignedUrl(fileName: string, bucketName: string): Promise<string> {
    const getObjectCommand = new GetObjectCommand({
      Key: fileName,
      Bucket: bucketName,
    });
    return getSignedUrl(this.s3Client, getObjectCommand, {
      expiresIn: IMAGE_EXPIRATION_TIME,
    });
  }
}
