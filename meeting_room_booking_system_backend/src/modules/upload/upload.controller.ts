import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException, BadRequestException } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequireLogin } from 'src/decorator/custom.decorator';
import { ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import { storage } from 'src/utils/file-storage';


@ApiTags('File Manger')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  @RequireLogin()
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const decodedFilename = Buffer.from(file.originalname, 'latin1').toString('utf-8');
    return {
      message: 'File uploaded successfully',
      fileName:decodedFilename,
      filePath: `\\${file.path}`,
    }
  }
}
