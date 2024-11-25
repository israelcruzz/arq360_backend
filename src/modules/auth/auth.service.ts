import { Injectable } from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';
import { UserInterface } from '../user/repositories/user.interface';
import * as bcrypt from 'bcrypt';
import { TokenService } from './services/token.service';
import { MailService } from '@/shared/mail/mail.service';
import { generateCode } from '@/shared/utils/forgot-password-code-generator';

@Injectable()
export class AuthService {
  private readonly _tokenService: TokenService;
  private readonly _userService: UserInterface;
  private readonly _mailService: MailService;

  constructor(
    tokenService: TokenService,
    userService: UserInterface,
    mailService: MailService,
  ) {
    this._tokenService = tokenService;
    this._userService = userService;
    this._mailService = mailService;
  }

  public async signIn(data: SignInDto) {
    const { email, password } = data;

    const userExists = await this._userService.getUserByEmail(email);

    if (!userExists) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, userExists.password);

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const payload = { sub: userExists.id };
    const accessToken = await this._tokenService.generateToken(payload);
    const refreshToken = await this._tokenService.generateRefreshToken(payload);

    await this._userService.saveRefreshToken(userExists.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async forgotPassword(email: string) {
    const userExists = await this._userService.getUserByEmail(email);

    if (!userExists) {
      throw new Error('User not found');
    }

    const codeToForgotPassword = generateCode();

    const messageTemplate = `
      <div style="font-size: 16;">
        <h2>Altere sua senha</h2>
        <p>Olá <span style="font-weight: bold;">${userExists.name},</span></p>
        <p>Para alterar sua senha, use o seguinte código:</p>
        <span>Your code: <span style="font-weight: bold; font-size: 18;">${codeToForgotPassword}</span> </span>
        <p>Se voce não solicitou essa alteração, ignore este e-mail.</p>

        <div style="display: flex; gap: 24px">
          <img src="" width="24px" height alt="company logo" />
          <span style="font-weight: bold; font-size: 12;">ARQ360</span>
        </div>
      </div>
      `;

    await this._mailService.sendMail({
      to: email,
      subject: 'Alterar senha | ARQ360',
      template: messageTemplate,
    });

    await this._userService.saveCodePassword(
      userExists.id,
      codeToForgotPassword,
    );

    return 'Email sended successfully';
  }

  public async verifyCode(code: string, email: string) {
    const userExists = await this._userService.getUserByEmail(email);

    if (!userExists) {
      throw new Error('User not found');
    }

    if (!userExists.passwordCode) {
      throw new Error('Code not found');
    }

    if (userExists.passwordCodeExpires < new Date()) {
      throw new Error('Code expired');
    }

    if (userExists.passwordCode === code) {
      return {
        message: 'Code is valid',
        statusCode: 200,
      };
    }
  }

  public async resetPassword(data: { email: string; newPassword: string }) {
    const { email, newPassword } = data;

    const userExists = await this._userService.getUserByEmail(email);

    if (!userExists) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 6);

    await this._userService.updatePassword(userExists.id, hashedPassword);

    return {
      message: 'Password updated successfully',
      statusCode: 200,
    };
  }
}
