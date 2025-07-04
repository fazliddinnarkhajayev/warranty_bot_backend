import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserRole } from 'src/shared/enums/user-roles.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(UserRole, { message: 'role must be one of: ADMIN, ORG_HEAD, ORG_WORKER' })
  role: UserRole;
}
