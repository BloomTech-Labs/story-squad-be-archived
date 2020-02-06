import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateCanonDTO {
  @IsNumber()
  public week: number;

  @IsString()
  public base64: string;

  @IsString()
  @IsOptional()
  public altbase64?: string;
}
