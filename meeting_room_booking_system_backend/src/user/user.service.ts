import { LoginUserDto } from './dto/login-user.dto';
import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Permission } from './entities/permission.entity'
import { Role } from './entities/role.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
import { LoginUserVo } from './vo/login.user.vo';

@Injectable()
export class UserService {

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  //  注入redis服务
  @Inject(RedisService)
  private redisService: RedisService;

  // 注册方法
  async register(user: RegisterUserDto) {
    // 在redis中获取用户邮箱对应的验证码 
    const captcha = await this.redisService.get(`captcha_${user.email}`)

    console.log(`captcha_${user.email}`)
    if (!captcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST)
    }

    if (captcha != user.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST)
    }

    // 根据用户名查询是否已经存在
    const foundUser = await this.userRepository.findOneBy({ username: user.username })

    if (foundUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST)
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
      throw new HttpException('注册失败', HttpStatus.BAD_REQUEST)
    }
  }

  // 数据初始化方法
  async initData() {
    const user1 = new User();
    user1.username = "zhangsan";
    user1.password = md5("111111");
    user1.email = "xxx@xx.com";
    user1.isAdmin = true;
    user1.nickName = '张三';
    user1.phoneNumber = '13233323333';

    const user2 = new User();
    user2.username = 'lisi';
    user2.password = md5("222222");
    user2.email = "yy@yy.com";
    user2.nickName = '李四';

    const role1 = new Role();
    role1.name = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  // login 
  async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin
      },
      relations: [ 'roles', 'roles.permissions']
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    }

    if (user.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
    }

    const vo = new LoginUserVo()
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      headPic: user.headPic,
      createTime: user.createTime.getTime(),
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: user.roles.map(item => item.name),
      // permissions:user.roles.reduce((arr,item)=>{
      //   item.permissions.forEach(permission=>{
      //     if(arr.indexOf(permission) == -1){
      //       arr.push(permission)
      //     }
      //   })
      //   return arr
      // },[])
      permissions: Array.from(user.roles.reduce((set, role) => {
        role.permissions.forEach(permission => set.add(permission));
        return set
      }, new Set())) as string[]
    }
    return vo

  }

  async findUserById(userId: number, isAdmin: boolean) {
    const user =  await this.userRepository.findOne({
        where: {
            id: userId,
            isAdmin
        },
        relations: [ 'roles', 'roles.permissions']
    });

    return {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        roles: user.roles.map(item => item.name),
        permissions: user.roles.reduce((arr, item) => {
            item.permissions.forEach(permission => {
                if(arr.indexOf(permission) === -1) {
                    arr.push(permission);
                }
            })
            return arr;
        }, [])
    }
}

}
