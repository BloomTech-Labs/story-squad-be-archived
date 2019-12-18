import { IsEmail, IsString, Length } from 'class-validator';
import { LoginDTO } from './login.dto';

class RegisterDTO extends LoginDTO {
    @IsEmail()
    username: string;

    @IsString()
    @Length(8)
    password: string;
}

export { RegisterDTO };
