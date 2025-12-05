import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qiniu from 'qiniu';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class QiniuService {
  private mac: qiniu.auth.digest.Mac;
  private config: qiniu.conf.Config;
  private bucketManager: qiniu.rs.BucketManager;
  private bucket: string;
  private domain: string;

  constructor(private configService: ConfigService) {
    const accessKey = this.configService.get<string>('QINIU_ACCESS_KEY', '');
    const secretKey = this.configService.get<string>('QINIU_SECRET_KEY', '');
    this.bucket = this.configService.get<string>('QINIU_BUCKET', '');
    this.domain = this.configService.get<string>('QINIU_DOMAIN', '');
    const zone = this.configService.get<string>('QINIU_ZONE', 'z2');

    this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    this.config = new qiniu.conf.Config();

    // 设置区域
    switch (zone) {
      case 'z0':
        this.config.zone = qiniu.zone.Zone_z0;
        break;
      case 'z1':
        this.config.zone = qiniu.zone.Zone_z1;
        break;
      case 'z2':
        this.config.zone = qiniu.zone.Zone_z2;
        break;
      case 'na0':
        this.config.zone = qiniu.zone.Zone_na0;
        break;
      case 'as0':
        this.config.zone = qiniu.zone.Zone_as0;
        break;
      default:
        this.config.zone = qiniu.zone.Zone_z2;
    }

    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
  }

  /**
   * 获取上传凭证
   */
  getUploadToken(key?: string): string {
    const options = {
      scope: key ? `${this.bucket}:${key}` : this.bucket,
      expires: 3600, // 1小时有效期
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(this.mac);
  }

  /**
   * 上传文件到七牛云
   */
  async uploadFile(file: Express.Multer.File): Promise<{ url: string; key: string }> {
    return new Promise((resolve, reject) => {
      const key = this.generateKey(file.originalname);
      const token = this.getUploadToken(key);
      const formUploader = new qiniu.form_up.FormUploader(this.config);
      const putExtra = new qiniu.form_up.PutExtra();

      formUploader.put(
        token,
        key,
        file.buffer,
        putExtra,
        (err, body, info) => {
          if (err) {
            reject(err);
            return;
          }

          if (info.statusCode === 200) {
            const url = `${this.domain}/${body.key}`;
            resolve({ url, key: body.key });
          } else {
            reject(new Error(`Upload failed with status ${info.statusCode}`));
          }
        },
      );
    });
  }

  /**
   * 批量上传文件
   */
  async uploadFiles(files: Express.Multer.File[]): Promise<Array<{ url: string; key: string }>> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  /**
   * 删除文件
   */
  async deleteFile(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(this.bucket, key, (err, respBody, respInfo) => {
        if (err) {
          reject(err);
          return;
        }

        if (respInfo.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Delete failed with status ${respInfo.statusCode}`));
        }
      });
    });
  }

  /**
   * 批量删除文件
   */
  async deleteFiles(keys: string[]): Promise<void> {
    const deleteOps = keys.map((key) => qiniu.rs.deleteOp(this.bucket, key));

    return new Promise((resolve, reject) => {
      this.bucketManager.batch(deleteOps, (err, respBody, respInfo) => {
        if (err) {
          reject(err);
          return;
        }

        if (respInfo.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Batch delete failed with status ${respInfo.statusCode}`));
        }
      });
    });
  }

  /**
   * 生成唯一的文件key
   */
  private generateKey(originalName: string): string {
    const ext = originalName.split('.').pop();
    const timestamp = Date.now();
    const uuid = uuidv4();
    return `uploads/${timestamp}-${uuid}.${ext}`;
  }

  /**
   * 从URL中提取key
   */
  extractKeyFromUrl(url: string): string {
    return url.replace(`${this.domain}/`, '');
  }
}
