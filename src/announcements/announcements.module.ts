import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.controller';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [AnnouncementsController],
})
export class AnnouncementsModule {}
