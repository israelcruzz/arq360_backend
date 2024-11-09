import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateInformationsUserDto,
  UpdatePassowordDto,
} from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { ResponseEntity } from '@/shared/entities/response.entity';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('/users')
export class UserController {
  private readonly _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  @Get('user')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getUser(@Request() req: Express.Request) {
    const user = await this._userService.getUserById(req.user.sub);

    return {
      data: user,
      statusCode: HttpStatus.OK,
      message: 'User found',
    };
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(
    @Body() data: CreateUserDto,
  ): Promise<ResponseEntity<string>> {
    const userId = await this._userService.createUser(data);

    return {
      data: userId,
      statusCode: HttpStatus.CREATED,
      message: 'User created',
    };
  }

  @Patch('photo')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async updatePhoto(
    @Request() req: Express.Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const url = await this._userService.uploadPhoto(req.user.sub, file);

    return {
      data: url,
      statusCode: HttpStatus.OK,
      message: 'Photo updated',
    };
  }

  @Patch('informations')
  @HttpCode(HttpStatus.OK)
  public async updateInformations(
    @Request() req: Express.Request,
    @Body() data: UpdateInformationsUserDto,
  ): Promise<ResponseEntity<string>> {
    const responseUserId = await this._userService.updateInformationsFromUser(
      req.user.sub,
      data,
    );

    return {
      data: responseUserId,
      statusCode: HttpStatus.OK,
      message: 'Informations updated',
    };
  }

  @Patch('password')
  @HttpCode(HttpStatus.OK)
  public async updatePassword(
    @Request() req: Express.Request,
    @Body() data: UpdatePassowordDto,
  ) {
    const responseUserId = await this._userService.updatePassword(
      req.user.sub,
      data,
    );

    return {
      data: responseUserId,
      statusCode: HttpStatus.OK,
      message: 'Password updated',
    };
  }
}
