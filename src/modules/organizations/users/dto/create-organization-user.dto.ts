import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrganizationUserDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  created_by: number;
}
