import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

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
  async captcha(@Query('address') address: string) {
    // 获取随机验证码
    const code = Math.random().toString().slice(2, 8)

    // 将随机验证码存入redis中，并添加到期时间
    this.redisService.set(`captcha_${address}`, code, 30 * 60)

    // 调用emailServer中的发送邮件接口
    this.emailService.sendEmail({
      to: address,
      subject: '注册验证码',
      html: `<h1>您的验证码是${code}</h1>`
    })

    return '发送成功'

  }

  // 数据初始化接口
  @Get("init-data")
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  //  普通用户登录
  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false)

    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    }, { expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m' })

    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });

    return vo
  }

  //  管理员用户登录
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true)

    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });
    return vo
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, false);

      const access_token = this.jwtService.sign({
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions
      }, {
        expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
      });

      const refresh_token = this.jwtService.sign({
        userId: user.id
      }, {
        expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
      });

      return {
        access_token,
        refresh_token
      }
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, true);

      const access_token = this.jwtService.sign({
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions
      }, {
        expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
      });

      const refresh_token = this.jwtService.sign({
        userId: user.id
      }, {
        expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
      });

      return {
        access_token,
        refresh_token
      }
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId)
    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createTime = user.createTime;
    vo.isFrozen = user.isFrozen;

    return vo
  }

  //  修改密码接口
  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(@UserInfo('userId') userId: number, @Body() passwordDto: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(userId, passwordDto)
  }

  // 修改密码邮箱验证码发送接口
  @Get('update_password/captcha')
  async updateCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`update_password_captcha_${address}`, code, 10 * 60);

    await this.emailService.sendEmail({
      to: address,
      subject: '更改密码验证码',
      html: `<p>你的验证码是 ${code}</p>`
    });
    return '发送成功';
  }

  // 修改用户信息
  @Post(['update', 'admin/update'])
  @RequireLogin()
  async updateUser(@UserInfo('userId') userId:number,@Body() updateUserDto: UpdateUserDto){
    return await this.userService.updateUser( userId,updateUserDto)
  }

   // 修改密码邮箱验证码发送接口
   @Get('update_userInfo/captcha')
   async updateUserCaptcha(@Query('address') address: string) {
     const code = Math.random().toString().slice(2, 8);
 
     await this.redisService.set(`update_password_captcha_${address}`, code, 10 * 60);
 
     await this.emailService.sendEmail({
       to: address,
       subject: '更改密码验证码',
       html: `<p>你的验证码是 ${code}</p>`
     });
     return '发送成功';
   }

   // 用户列表
   @Get('list')
   @RequireLogin()
   async userList(@Query() {}){}

   // 用户冻结

}
