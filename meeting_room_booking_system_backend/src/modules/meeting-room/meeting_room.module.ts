import { Module } from '@nestjs/common';
import { MeetingRoomService } from './meeting_room.service';
import { MeetingRoomController } from './meeting_room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting_room.entity';

@Module({
  controllers: [MeetingRoomController],
  providers: [MeetingRoomService],
  imports:[
    TypeOrmModule.forFeature([MeetingRoom])
  ]
})
export class MeetingRoomModule {}
