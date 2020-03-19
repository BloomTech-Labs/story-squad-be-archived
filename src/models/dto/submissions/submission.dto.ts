import { IsString } from 'class-validator';

class Pages {
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
}

export class SubmissionDTO {
    story: Pages;

    @IsString()
    storyText: string;

    @IsString()
    illustration: string;
}

export class StoryDTO {
    story: Pages;

    @IsString()
    storyText: string;
}

export class IllustrationDTO {
    @IsString()
    illustration: string;
}
