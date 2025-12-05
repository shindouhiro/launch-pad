import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { QiniuModule } from '../qiniu/qiniu.module';

@Module({
  imports: [QiniuModule],
  controllers: [UploadController],
})
export class UploadModule { }
