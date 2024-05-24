import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis'

@Injectable()
export class RedisService {

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string): Promise<string> {
    return await this.redisClient.get(key)
  }

  async set(key: string, value: string|number,ttl?: number){
    await this.redisClient.set(key,value)

    //  set 方法支持指定过期时间。
    if(ttl){
      await this.redisClient.expire(key,ttl)
    }
  }

}
