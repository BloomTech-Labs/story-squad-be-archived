import { IsString } from 'class-validator';

export class SubmissionDTO {
    @IsString()
    page1: string;

    @IsString()
    page2: string;

    @IsString()
    page3: string;

    @IsString()
    page4: string;

    @IsString()
    page5: string;

    @IsString()
    storyText: string;

    @IsString()
    illustration: string;
}
