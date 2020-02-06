import { IsArray, IsString, IsOptional } from 'class-validator';

export class UpdateSubmissionDTO {
  @IsArray()
  public illustration: string[];

  @IsArray()
  public story: string[];

  @IsString()
  @IsOptional()
  public storyText?: string;
}
