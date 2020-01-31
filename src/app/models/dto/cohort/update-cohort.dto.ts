import { IsEmpty, IsString } from 'class-validator';

export class UpdateCohortDTO {
  @IsEmpty()
  public id?: number;

  @IsEmpty()
  public week?: number;

  @IsEmpty()
  public activity?: string;

  @IsString()
  public name: string;
}
