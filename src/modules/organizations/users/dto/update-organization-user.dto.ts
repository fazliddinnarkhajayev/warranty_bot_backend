import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrganizationUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
