import { IsEmail, IsIn, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: string;
}
