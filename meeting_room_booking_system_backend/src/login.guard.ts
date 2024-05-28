import { CanActivate, ExecutionContext, Injectable,Inject, HttpException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Permission } from './user/entities/permission.entity';
import { Request } from 'express'
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

interface JwtUserData {
  userId:number
  username:string
  roles: string[]
  permissions: Permission[]
}

// 给 `express` 模块中 `Requset` 添加 添加自定义属性
declare module 'express' {
  interface Request {
    user: JwtUserData
  }
}

@Injectable()
export class LoginGuard implements CanActivate {

  //  reflector获取类或方法上的元数据
  @Inject()
  private reflector:Reflector

  @Inject(JwtService)
  private jwtService:JwtService

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 获取请求信息'
    const request:Request = context.switchToHttp().getRequest()

    //获取类或方法上的 require-login 元数据。如果没有找到这个元数据，则返回 undefined。
    const requireLogin = this.reflector.getAllAndOverride<boolean>('require-login',[
      context.getClass(),
      context.getHandler()
    ])

    if(!requireLogin) {
      // 如果没有要求登录，直接通过
      return true
    }

    // 检查请求是否包含的token
    const authorization = request.headers['authorization']
    if(!authorization) {
      throw new UnauthorizedException('用户未登录') 
    }

    // 验证token
    try {
      const token = authorization.split(' ')[1]
      const data = this.jwtService.verify(token)

      request.user = {
        userId: data.userId,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions
      }
      return true
    } catch (error) {
      throw new UnauthorizedException('token失效')
    }
  }
}
