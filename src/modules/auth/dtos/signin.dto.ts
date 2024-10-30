import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export abstract class SignInDto {
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  public email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters',
  })
  public password: string;
}
