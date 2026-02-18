import { Module } from '@nestjs/common';
import { AcademicsController } from './academics.controller';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [AcademicsController],
})
export class AcademicsModule {}
