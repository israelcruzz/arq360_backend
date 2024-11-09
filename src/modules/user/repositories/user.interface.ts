import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { UpdateInformationsUserDto } from '@/modules/user/dtos/update-informations-user.dto';
import { User } from '@prisma/client';

export abstract class UserInterface {
  abstract createUser(data: CreateUserDto): Promise<string>;
  abstract getUserById(userId: string): Promise<User | null>;
  abstract updateInformationsFromUser(
    userId: string,
    data: UpdateInformationsUserDto,
  ): Promise<string>;
  abstract updatePassword(userId: string, newPassword: string): Promise<string>;
  abstract getUserByEmail(email: string): Promise<User>;
  abstract uploadPhoto(userId: string, url: string): Promise<void>;
  abstract saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void>;
}
