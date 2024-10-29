import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateInformationsUserDto,
  UpdatePassowordDto,
} from './dtos';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserInterface } from './repositories/user.interface';
import { StorageService } from '@/shared/storage/storage.service';

@Injectable()
export class UserService {
  private readonly _userRepository: UserInterface;
  private readonly _storageService: StorageService;

  constructor(userRepository: UserInterface, storageService: StorageService) {
    this._userRepository = userRepository;
    this._storageService = storageService;
  }

  public async createUser(data: CreateUserDto): Promise<string> {
    const { name, email, password } = data;

    const hashPass = await bcrypt.hash(password, 6);

    const userData: CreateUserDto = {
      name,
      email,
      password: hashPass,
    };

    const responseRepository = await this._userRepository.createUser(userData);

    return responseRepository;
  }

  public async getUserById(userId: string): Promise<User> {
    const responseRepository = await this._userRepository.getUserById(userId);

    if (!responseRepository) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return responseRepository;
  }

  public async updateInformationsFromUser(
    userId: string,
    data: UpdateInformationsUserDto,
  ): Promise<string> {
    const userExists = await this._userRepository.getUserById(userId);

    if (!userExists) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const responseRepository =
      await this._userRepository.updateInformationsFromUser(userId, data);

    return responseRepository;
  }

  public async updatePassword(
    userId: string,
    data: UpdatePassowordDto,
  ): Promise<string> {
    const userExists = await this._userRepository.getUserById(userId);

    if (!userExists) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const { currentPassword, newPassword } = data;

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      userExists.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Current password is invalid');
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 6);

    const responseRepository = await this._userRepository.updatePassword(
      userId,
      hashNewPassword,
    );

    return responseRepository;
  }

  public async uploadPhoto(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const data = await this._storageService.upload(file);

    await this._userRepository.uploadPhoto(userId, data.data.path);

    return data.data.path;
  }
}
