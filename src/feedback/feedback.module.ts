import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
