import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting_room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting_room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingRoom } from './entities/meeting_room.entity';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository:Repository<MeetingRoom>

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

  
  async getList(pageNo: number, pageSize: number) {
    if(pageNo<0){
      return new HttpException('pageNo必须大于0', HttpStatus.BAD_REQUEST)
    }
    const sikp = (pageNo - 1) * pageSize

    const [meetingRoomList,totalCount] = await this.repository.findAndCount({
      skip:sikp,
      take:pageSize
    })
    return {
      meetingRoomList,
      totalCount
    }
  }
}