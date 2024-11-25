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
import { Convenient } from '@prisma/client';
import { PrismaService } from '@/shared/services/prisma.service';
import { StorageService } from '@/shared/storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseEntity } from '@/shared/entities/response.entity';

@Controller('convenients')
export class ConvenientController {
  private readonly _db: PrismaService;
  private readonly _storageService: StorageService;

  constructor(db: PrismaService, storageService: StorageService) {
    this._db = db;
    this._storageService = storageService;
  }

  @Post(':projectId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  public async create(
    @Request() req: Express.Request,
    @Body() data: Omit<Convenient, 'coverUrl'>,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    file: Express.Multer.File,
    @Param('projectId') projectId: string,
  ): Promise<ResponseEntity<string>> {
    const {
      data: { path },
    } = await this._storageService.upload(file);

    const convenient = await this._db.convenient.create({
      data: {
        ...data,
        projectId,
        coverUrl: path,
      },
    });

    return {
      message: 'Convenient created',
      data: convenient.id,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get(':projectId')
  @UseGuards(AuthGuard)
  public async getAll(
    @Param('projectId') projectId: string,
    @Request() req: Express.Request,
  ): Promise<ResponseEntity<Convenient[]>> {
    const convenients = await this._db.convenient.findMany({
      where: {
        projectId,
        project: {
          userId: req.user.sub,
        },
      },
    });

    if (!convenients) {
      throw new Error('Convenients not found');
    }

    return {
      message: 'Convenients found',
      data: convenients,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async delete(
    @Param('id') id: string,
  ): Promise<ResponseEntity<string>> {
    const convenient = await this._db.convenient.findUnique({
      where: {
        id,
      },
    });

    if (!convenient) {
      throw new Error('Convenient not found');
    }

    await this._db.convenient.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Convenient deleted',
      data: id,
      statusCode: HttpStatus.OK,
    };
  }
}
