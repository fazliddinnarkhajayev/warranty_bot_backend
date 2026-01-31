import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTechnicianDto {

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  district_id: number;

  @IsNumber()
  @IsNotEmpty()
  region_id: number;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;
}
