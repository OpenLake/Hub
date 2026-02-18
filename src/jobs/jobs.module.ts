import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [JobsController],
})
export class JobsModule {}
