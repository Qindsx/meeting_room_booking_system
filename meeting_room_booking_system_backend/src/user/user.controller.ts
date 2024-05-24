import { Controller, Get, Post, Body, Patch, Param, Delete,Query,Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // 注册接口
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser)
    // console.log(registerUser);
    // return "success"
  }

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  // 邮箱发送接口
  @Get('register-captcha')
  async captcha(@Query('address') address:string) {
    // 获取随机验证码
    const code = Math.random().toString().slice(2,8)

    // 将随机验证码存入redis中，并添加到期时间
    this.redisService.set(`captcha_${address}`,code, 5 * 60)

    // 调用emailServer中的发送邮件接口
    this.emailService.sendEmail({
      to:address,
      subject: '注册验证码',
      html:`<h1>您的验证码是${code}</h1>`
    })

    return '发送成功'

  }
}
