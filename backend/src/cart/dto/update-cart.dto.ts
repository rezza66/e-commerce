import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}