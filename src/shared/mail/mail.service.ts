import { Injectable } from '@nestjs/common';
import { MailInterface, SendMail } from './mail.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService implements MailInterface {
  constructor(private readonly mailerService: MailerService) {}

  public async sendMail({ subject, template, to }: SendMail) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
      });
    } catch (error) {
      console.error({ message: 'Error in Send Message', error });
    }
  }
}
