import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [MarketplaceController],
})
export class MarketplaceModule {}
