export interface SendMail {
  to: string;
  subject: string;
  template: string;
}

export abstract class MailInterface {
  abstract sendMail({ subject, template, to }: SendMail): Promise<void>;
}
