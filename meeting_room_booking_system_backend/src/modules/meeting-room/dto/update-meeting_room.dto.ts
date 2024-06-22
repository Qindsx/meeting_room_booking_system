import { PartialType } from '@nestjs/swagger';
import { CreateMeetingRoomDto } from './create-meeting_room.dto';

export class UpdateMeetingRoomDto extends PartialType(CreateMeetingRoomDto) {}
