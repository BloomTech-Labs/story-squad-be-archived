import { IsNumber, IsString } from 'class-validator';

export class AddCanonDTO {
    @IsString()
    base64: string;

    @IsNumber()
    week: number;
}
