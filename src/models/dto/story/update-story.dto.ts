import { IsEmpty, IsBoolean } from 'class-validator';

export class UpdateStoryDTO {
    @IsEmpty()
    id?: number;

    @IsEmpty()
    week?: number;

    @IsBoolean()
    isFlagged?: boolean;
}
