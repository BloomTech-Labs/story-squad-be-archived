import { IsEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCohortDTO {
    @IsEmpty()
    id?: number;

    @IsNumber()
    week: number;

    @IsString()
    activity: string;
}
