import { Injectable } from '@nestjs/common';
import { UserInterface } from './user.interface';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateInformationsUserDto } from '../dtos';
import { PrismaService } from '@/shared/services/prisma.service';

@Injectable()
export class UserRepository implements UserInterface {
  private readonly _db: PrismaService;

  constructor(prismaService: PrismaService) {
    this._db = prismaService;
  }

  public async createUser(data: CreateUserDto): Promise<string> {
    const { name, email, password } = data;

    const user = await this._db.user.create({
      data: {
        name,
        email,
        password,
      },
      select: {
        id: true,
      },
    });

    return user.id;
  }
  public async getUserById(userId: string): Promise<User | null> {
    const user = await this._db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  public async updateInformationsFromUser(
    userId: string,
    data: UpdateInformationsUserDto,
  ): Promise<string> {
    const { email, name } = data;

    const user = await this._db.user.update({
      where: {
        id: userId,
      },
      data: {
        email,
        name,
        updatedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    return user.id;
  }
  public async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<string> {
    const user = await this._db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
        updatedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    return user.id;
  }
  public async getUserByEmail(email: string): Promise<User> {
    const user = await this._db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  public async uploadPhoto(userId: string, url: string): Promise<void> {
    await this._db.user.update({
      where: {
        id: userId,
      },
      data: {
        image: url,
        updatedAt: new Date(),
      },
      select: {
        image: true,
      },
    });
  }
}
