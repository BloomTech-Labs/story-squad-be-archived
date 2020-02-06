import { IsString } from 'class-validator';

export class AddCardDTO {
  @IsString()
  public id: string;
}
