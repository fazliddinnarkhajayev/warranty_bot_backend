import { IsNotEmpty,  IsString } from 'class-validator';

export class SetDueDateTaskDto {
  @IsString()
  @IsNotEmpty()
  due_date: string;
}