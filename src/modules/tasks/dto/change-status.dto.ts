import { IsEnum, IsNotEmpty } from 'class-validator';
export enum TaskStatus {
  IN_PROCESS = 'IN_PROCESS',
  DONE = 'DONE'
}
export class ChangeStatusDto {

  @IsNotEmpty()
  @IsEnum(TaskStatus, { message: 'Status must be one of: IN_PROCESS, DONE' })
  status: string;

}