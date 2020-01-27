import { IsString } from 'class-validator';

export class SubmissionDTO {
    @IsString()
    story: string;

    @IsString()
    storyText: string;

    @IsString()
    illustration: string;
}
