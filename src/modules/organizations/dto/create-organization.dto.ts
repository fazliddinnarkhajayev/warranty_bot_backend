import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrganizationDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  created_by: number;
}
