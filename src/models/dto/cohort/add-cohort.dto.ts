import { IsNumber, IsString } from 'class-validator';

export class AddCohortDTO {
    @IsNumber()
    id: number;

    @IsNumber()
    week: number;

    @IsString()
    activity: string;
}
