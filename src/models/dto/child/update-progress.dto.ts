import { IsBoolean, IsOptional } from 'class-validator';

import { Activities } from '../../internal';

export class UpdateProgressDTO implements Partial<Activities> {
    @IsBoolean()
    @IsOptional()
    reading?: boolean;

    @IsBoolean()
    @IsOptional()
    writing?: boolean;

    @IsBoolean()
    @IsOptional()
    drawing?: boolean;

    @IsBoolean()
    @IsOptional()
    teamReview?: boolean;

    @IsBoolean()
    @IsOptional()
    randomReview?: boolean;

    @IsBoolean()
    @IsOptional()
    results?: boolean;
}
