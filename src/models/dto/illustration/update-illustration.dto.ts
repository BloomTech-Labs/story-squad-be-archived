import { IsEmpty, IsBoolean } from 'class-validator';

export class UpdateIllustrationDTO {
    @IsEmpty()
    id?: number;

    @IsEmpty()
    week?: number;

    @IsBoolean()
    isFlagged?: boolean;
}
