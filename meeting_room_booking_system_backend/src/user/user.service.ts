import { Injectable, Logger,Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  //  注入redis服务
  @Inject(RedisService)
  private redisService: RedisService;

  // 注册方法
  async register(user: RegisterUserDto) {
      // 在redis中获取用户邮箱对应的验证码 
    const captcha = await this.redisService.get(`captcha_${user.email}`)

    console.log(`captcha_${user.email}`)
    if(!captcha) {
      throw new HttpException( '验证码已过期', HttpStatus.BAD_REQUEST)
    }

    if(captcha != user.captcha) {
      throw new HttpException( '验证码错误', HttpStatus.BAD_REQUEST)
    }

    // 根据用户名查询是否已经存在
    const foundUser = await this.userRepository.findOneBy({username: user.username})

    if(foundUser) {
      throw new HttpException( '用户名已存在', HttpStatus.BAD_REQUEST)
    }

    // 初始化DTO对象
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      this.logger.error(error,UserService)
      throw new HttpException( '注册失败', HttpStatus.BAD_REQUEST)
    }

  }
}
