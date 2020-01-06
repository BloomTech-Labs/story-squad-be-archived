import { IsEmail, IsString, Length, IsBoolean } from 'class-validator';
import { LoginDTO } from './login.dto';

class RegisterDTO extends LoginDTO {
    @IsEmail()
    username: string;

    @IsString()
    @Length(8)
    password: string;

    @IsBoolean()
    termsOfService: boolean;
}

export { RegisterDTO };
