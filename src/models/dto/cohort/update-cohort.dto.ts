import { IsEmpty, IsString } from 'class-validator';

export class UpdateCohortDTO {
    @IsEmpty()
    id?: number;

    @IsEmpty()
    week?: number;

    @IsEmpty()
    activity?: string;

    @IsString()
    name: string;
}
