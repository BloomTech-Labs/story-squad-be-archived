import { IsNumber, IsString } from 'class-validator';

class CanonDTO {
    @IsString()
    base64: string;

    @IsNumber()
    week: number;
}

export { CanonDTO };
