import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { createTransport,Transporter} from 'nodemailer'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  transporter: Transporter

  constructor(private configServer: ConfigService){
    this.transporter = createTransport({
      host: this.configServer.get('nodemailer_host'),
      prot:this.configServer.get('nodemailer_port'),
      auth:{
        user: this.configServer.get('EMAIL_USER'),
        pass: this.configServer.get('EMAIL_AUTH')
      }
    })
  }

  async sendEmail({to,subject,html}){
    return this.transporter.sendMail({
      from:{
        name:'会议室预定系统',
        address: this.configServer.get('EMAIL_USER')
      },
      to,
      subject,
      html
    })
  }
}
