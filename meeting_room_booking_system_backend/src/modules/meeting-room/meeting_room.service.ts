import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting_room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MeetingRoom } from './entities/meeting_room.entity';
import { UpdateMeetingRoomDto } from './dto/update-meeting_room.dto';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository:Repository<MeetingRoom>

  // 初始化数据方法
  initData() {
    const room1 = new MeetingRoom();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层西';

    const room2 = new MeetingRoom();
    room2.name = '金星';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = '二层东';

    const room3 = new MeetingRoom();
    room3.name = '天王星';
    room3.capacity = 30;
    room3.equipment = '白板，电视';
    room3.location = '三层东';

    this.repository.insert([room1, room2, room3])
  }

  // 获取列表数据
  async getList(pageNo: number, pageSize: number,name:string,equipment:number,capacity:string) {
    if(pageNo<0){
      return new HttpException('pageNo必须大于0', HttpStatus.BAD_REQUEST)
    }
    const sikp = (pageNo - 1) * pageSize

    const condition: Record<string, any> = {};

    if(name) {
        condition.name = Like(`%${name}%`);   
    }
    if(equipment) {
        condition.equipment = Like(`%${equipment}%`); 
    }
    if(capacity) {
        condition.capacity = capacity;
    }


    const [meetingRoomList,totalCount] = await this.repository.findAndCount({
      skip:sikp,
      take:pageSize,
      where:condition
    })
    return {
      meetingRoomList,
      totalCount
    }
  }

  // 创建方法
  async cerate(meetingRoomDto:CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      name:meetingRoomDto.name
    })
    if(room) {
      throw new BadRequestException('该会议室已存在')
    }
    return (await this.repository.insert(meetingRoomDto)).generatedMaps
  }

  // 更新方法
  async update(updateMeetingRoomDto:UpdateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      id:updateMeetingRoomDto.id
    })

    if(room) {
      throw new BadRequestException('该会议室不存在')
    }

    room.capacity = updateMeetingRoomDto.capacity
    room.name = updateMeetingRoomDto.name
    room.location = updateMeetingRoomDto.location

    if(updateMeetingRoomDto.description) {
      room.description = updateMeetingRoomDto.description;
    }
    if(updateMeetingRoomDto.equipment) {
      room.equipment = updateMeetingRoomDto.equipment;
    }

    await this.repository.update({
      id: room.id
    } , room);
    return 'success';
  }

  // 删除
  async delete(id:number) {
    // todo 物理删除需要修改为逻辑删除
    return this.repository.delete(id)
  }

  //  详情
  async detail(id:number) {
    return await this.repository.findOneBy({
      id
    })
  }
}
