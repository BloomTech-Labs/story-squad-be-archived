import { IsString, IsNumber } from 'class-validator';

export class SubscribeDTO {
  @IsString()
  public plan: string;

  @IsNumber()
  public childID: number;
}
