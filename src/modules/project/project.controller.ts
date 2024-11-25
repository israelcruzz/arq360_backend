import { PrismaService } from '@/shared/services/prisma.service';
import { StorageService } from '@/shared/storage/storage.service';
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
import { ResponseEntity } from '@/shared/entities/response.entity';
import { Project } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('projects')
export class ProjectController {
  private readonly _db: PrismaService;
  private readonly _storageService: StorageService;

  constructor(db: PrismaService, storageService: StorageService) {
    this._db = db;
    this._storageService = storageService;
  }

  @Get()
  @UseGuards(AuthGuard)
  public async getProjects(
    @Request() req: Express.Request,
  ): Promise<ResponseEntity<Project[]>> {
    const projects = await this._db.project.findMany({
      where: {
        userId: req.user.sub,
      },
    });

    if (!projects) {
      throw new Error('Projects not found');
    }

    return {
      message: 'Projects found',
      data: projects,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  public async getProject(
    @Param('id') id: string,
    @Request() req: Express.Request,
  ): Promise<ResponseEntity<Project>> {
    const project = await this._db.project.findUnique({
      where: {
        id,
        userId: req.user.sub,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return {
      message: 'Project found',
      data: project,
      statusCode: HttpStatus.OK,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  public async createProject(
    @Request() req: Express.Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    file: Express.Multer.File,
    @Body() data: Omit<Project, 'projectImage'>,
  ) {
    const {
      data: { path },
    } = await this._storageService.upload(file);

    const project = await this._db.project.create({
      data: {
        ...data,
        userId: req.user.sub,
        imageCover: path,
      },
    });

    return {
      message: 'Project created',
      data: project.id,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async deleteProject(
    @Param('id') id: string,
    @Request() req: Express.Request,
  ): Promise<ResponseEntity<string>> {
    const project = await this._db.project.findUnique({
      where: {
        id,
        userId: req.user.sub,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    await this._db.project.delete({
      where: {
        id,
        userId: req.user.sub,
      },
    });

    return {
      message: 'Project deleted',
      data: id,
      statusCode: HttpStatus.OK,
    };
  }
}
