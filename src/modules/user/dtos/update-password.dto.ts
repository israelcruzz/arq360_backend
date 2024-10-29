import { IsNotEmpty, IsString, Length } from 'class-validator';

export abstract class UpdatePassowordDto {
  @IsString({ message: 'Current password must be a string' })
  @IsNotEmpty({ message: 'Current password is required' })
  @Length(8, 20, {
    message: 'Current password must be between 8 and 20 characters',
  })
  public currentPassword: string;

  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @Length(8, 20, {
    message: 'New password must be between 8 and 20 characters',
  })
  public newPassword: string;
}
