import { IsString, IsNumber } from 'class-validator';

export class SubscribeDTO {
    @IsString()
    plan: string;

    @IsNumber()
    childID: number;
}
