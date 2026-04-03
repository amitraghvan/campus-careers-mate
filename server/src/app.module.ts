// Ensure peer network setup is handled correctly in NestJS
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { PeerNetworkInterceptor } from './interceptors/peer-network.interceptor';

@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: PeerNetworkInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter }
  ]
})
export class AppModule {}
