import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [RedisService,{
    provide:'REDIS_CLIENT',
    async useFactory(configService:ConfigService){
      const clinet = createClient({
        socket:{
          host:'localhost',
          port:6479
        },
        database:1
      });
      await clinet.connect();
      return clinet
    }
  }],
  exports:[RedisService]
})
export class RedisModule {}
