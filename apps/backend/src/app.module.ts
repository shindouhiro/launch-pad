import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
  imports: [AuthModule, RecommendationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
