import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
