import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
