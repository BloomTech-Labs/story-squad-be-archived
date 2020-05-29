import { IsEmpty, IsString, IsBoolean } from 'class-validator';

export class UpdateStoryDTO {
    @IsEmpty()
    id?: number;

    @IsEmpty()
    week?: number;

    @IsBoolean()
    is_flagged?: boolean;
}
