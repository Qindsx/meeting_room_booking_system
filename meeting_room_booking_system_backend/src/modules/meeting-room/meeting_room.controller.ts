import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, DefaultValuePipe, Query } from '@nestjs/common';
import { MeetingRoomService } from './meeting_room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting_room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting_room.entity';
import { Repository } from 'typeorm';
import { generateParseIntPipe } from 'src/utils/utils';
import { RequireLogin } from 'src/decorator/custom.decorator';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) { }

  @Get('list')
  @RequireLogin()
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo')) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(2), generateParseIntPipe('pageSize')) pageSize: number,
  ){
    return await this.meetingRoomService.getList(pageNo,pageSize)
  }

  @Post('create')
  @RequireLogin()
  async create(@Body() meetingRoomDto:CreateMeetingRoomDto) {
    return await this.meetingRoomService.cerate(meetingRoomDto)
  }

}
