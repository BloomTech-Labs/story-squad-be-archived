import { IsString } from 'class-validator';

export class CardDTO {
    @IsString()
    id: string;
}
