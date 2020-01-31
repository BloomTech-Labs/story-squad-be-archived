import { IsString } from 'class-validator';

export class UpdateSubmissionDTO {
  @IsString()
  public story: string;

  @IsString()
  public storyText: string;

  @IsString()
  public illustration: string;
}
