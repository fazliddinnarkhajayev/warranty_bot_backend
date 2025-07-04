import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  created_by: number;

  org_id: number;
}
