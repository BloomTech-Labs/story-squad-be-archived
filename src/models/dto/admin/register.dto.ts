import { IsString, Matches } from 'class-validator';

class AdminRegisterDTO {
    @IsString()
    @Matches(/admin|^.*@.*\..*/) // 'admin' or 'any-chars@any-chars.any-chars'
    email: string;

    @IsString()
    @Matches(/admin|moderator/) // 'admin' or 'moderator'
    role: string;
}

export { AdminRegisterDTO };
