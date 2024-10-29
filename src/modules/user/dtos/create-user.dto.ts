import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 255, { message: 'Name must be between 3 and 255 characters' })
  public name: string;

  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  public email: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  @IsString({ message: 'A senha deve ser uma string' })
  @Length(8, 20, { message: 'A senha deve ter entre 8 e 20 caracteres' })
  public password: string;
}
