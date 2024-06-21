import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { Role } from './modules/user/entities/role.entity';
import { User } from './modules/user/entities/user.entity';
import { Permission } from './modules/user/entities/permission.entity';
import { RedisModule } from './modules/redis/redis.module';
import { EmailModule } from './modules/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core'
import { LoginGuard } from './guard/login.guard';
import { PermissionGuard } from './guard/permission.guard';
import { UploadModule } from './modules/upload/upload.module';
import { MeetingRoomModule } from './meeting_room/meeting_room.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global:true,
      useFactory(configService:ConfigService){
        return {
          secret:configService.get('JWT_SECRET'),
          signOptions:{
            expiresIn: '30m'
          }
        }
      },
      inject:[ConfigService]
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "127.0.0.1",
      port: 3306,
      username: "root",
      password: "123456",
      database: "meeting_room_booking_system",
      synchronize: true,
      logging: true,
      entities: [
        Role,User,Permission
      ],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
    UserModule,
    RedisModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'src/.env'
    }),
    UploadModule,
    MeetingRoomModule,
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_GUARD,
    useClass: LoginGuard
  },{
    provide:APP_GUARD,
    useClass: PermissionGuard
  }],
})
export class AppModule {}
