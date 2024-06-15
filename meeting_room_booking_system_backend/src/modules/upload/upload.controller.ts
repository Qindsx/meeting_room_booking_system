import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException, BadRequestException } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequireLogin } from 'src/decorator/custom.decorator';
import { ApiTags } from '@nestjs/swagger';
import * as path from 'path';


@ApiTags('File Manger')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('/file')
  @UseInterceptors(FileInterceptor('file', {
    dest: 'uploads',
    limits: {
      fileSize: 1024 * 1024 * 3
    },
    fileFilter(req, file, callback) {
      const extname = path.extname(file.originalname)
      if (['.jpg', '.png', '.gif'].includes(extname)) {
        callback(null, true)
      } else {
        callback(new BadRequestException('只能上传图片'), false)
      }
    }
  }))
  @RequireLogin()
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file.path)
    return file.path;
  }
}
