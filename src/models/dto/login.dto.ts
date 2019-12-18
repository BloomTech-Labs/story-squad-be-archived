import { IsEmail, IsString, Length } from 'class-validator';

class LoginDTO {
    @IsEmail()
    username: string;

    @IsString()
    @Length(8)
    password: string;
}

export { LoginDTO };
