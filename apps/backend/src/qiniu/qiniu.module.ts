import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QiniuService } from './qiniu.service';

@Module({
  imports: [ConfigModule],
  providers: [QiniuService],
  exports: [QiniuService],
})
export class QiniuModule { }
