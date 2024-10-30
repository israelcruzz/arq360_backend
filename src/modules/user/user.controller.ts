import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
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
import { User } from '@prisma/client';

@Controller('/users')
export class UserController {
  private readonly _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  public async getUser(
    @Param('userId') userId: string,
  ): Promise<ResponseEntity<User>> {
    const user = await this._userService.getUserById(userId);

    return {
      data: user,
      statusCode: HttpStatus.OK,
      message: 'User found',
    };
  }

  @Post('/signup')
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

  @Patch('/:userId/photo')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async updatePhoto(
    @Param('userId') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const url = await this._userService.uploadPhoto(userId, file);

    return {
      data: url,
      statusCode: HttpStatus.OK,
      message: 'Photo updated',
    };
  }

  @Patch('/:userId/informations')
  @HttpCode(HttpStatus.OK)
  public async updateInformations(
    @Param('userId') userId: string,
    @Body() data: UpdateInformationsUserDto,
  ): Promise<ResponseEntity<string>> {
    const responseUserId = await this._userService.updateInformationsFromUser(
      userId,
      data,
    );

    return {
      data: responseUserId,
      statusCode: HttpStatus.OK,
      message: 'Informations updated',
    };
  }

  @Patch('/:userId/password')
  @HttpCode(HttpStatus.OK)
  public async updatePassword(
    @Param('userId') userId: string,
    @Body() data: UpdatePassowordDto,
  ) {
    const responseUserId = await this._userService.updatePassword(userId, data);

    return {
      data: responseUserId,
      statusCode: HttpStatus.OK,
      message: 'Password updated',
    };
  }
}
