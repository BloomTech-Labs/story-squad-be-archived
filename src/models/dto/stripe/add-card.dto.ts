import { IsString } from 'class-validator';

export class AddCardDTO {
    @IsString()
    id: string;
}
