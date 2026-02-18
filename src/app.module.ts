import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy/proxy.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { AcademicsModule } from './academics/academics.module';
import { JobsModule } from './jobs/jobs.module';
import { HomeModule } from './home/home.module';
import { HealthModule } from './health/health.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AnnouncementsModule } from './announcements/announcements.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProxyModule,
    AuthModule,
    EventsModule,
    AnnouncementsModule,
    OrganizationsModule,
    FeedbackModule,
    MarketplaceModule,
    AcademicsModule,
    JobsModule,
    HomeModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
