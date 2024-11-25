import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Express } from 'express';
import { PrismaService } from '@/shared/services/prisma.service';
import { ResponseEntity } from '@/shared/entities/response.entity';
import { Client } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '@/shared/storage/storage.service';

@Controller('clients')
export class ClientController {
  private readonly _db: PrismaService;
  private readonly _storageService: StorageService;

  constructor(db: PrismaService, storageService: StorageService) {
    this._db = db;
    this._storageService = storageService;
  }

  @Get()
  @UseGuards(AuthGuard)
  public async getClients(
    @Request() req: Express.Request,
  ): Promise<ResponseEntity<Client[]>> {
    const clients = await this._db.client.findMany({
      where: {
        userId: req.user.sub,
      },
    });

    if (!clients) {
      throw new Error('Clients not found');
    }

    return {
      message: 'Clients found',
      data: clients,
      statusCode: HttpStatus.OK,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  public async createClient(
    @Request() req: Express.Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    file: Express.Multer.File,
    @Body() data: Omit<Client, 'clientImage'>,
  ): Promise<ResponseEntity<string>> {
    const {
      data: { path },
    } = await this._storageService.upload(file);

    const client = await this._db.client.create({
      data: {
        ...data,
        userId: req.user.sub,
        clientImage: path,
      },
    });

    return {
      message: 'Client created',
      data: client.id,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async deleteClient(
    @Request() req: Express.Request,
    @Param('id') id: string,
  ): Promise<ResponseEntity<string>> {
    const client = await this._db.client.findUnique({
      where: {
        id,
        userId: req.user.sub,
      },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    await this._db.client.delete({
      where: {
        id,
        userId: req.user.sub,
      },
    });

    return {
      message: 'Client deleted',
      data: id,
      statusCode: HttpStatus.OK,
    };
  }
}
