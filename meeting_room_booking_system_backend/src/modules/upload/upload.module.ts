import { BadRequestException, Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express/multer';
import { storage } from 'src/utils/file-storage';

@Module({
  imports: [
    MulterModule.register({
      storage: storage,
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('请上传图片！'), false);
        }
      },
      limits: {
        fileSize: 3 * 1024 * 1024, // 3 MB
      },
    }),
  ],
  providers:[UploadService],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
