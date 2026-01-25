import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  warranty_months: string;
}
