import { IsString } from 'class-validator';

export class AdminPasswordDTO {
  @IsString()
  public password: string;
}
