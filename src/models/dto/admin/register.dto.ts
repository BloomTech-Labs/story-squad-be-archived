import { IsString, MinLength } from 'class-validator';

class AdminRegisterDTO {
    @IsString()
    @MinLength(6)
    password: string;
}

export { AdminRegisterDTO };
