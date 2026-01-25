import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserRole } from 'src/shared/enums/user-roles.enum';

export class CreateSellerDto {

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
