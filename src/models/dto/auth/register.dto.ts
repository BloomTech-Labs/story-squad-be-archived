import { IsEmail, IsString, Length, IsBoolean } from 'class-validator';
import { LoginDTO } from './login.dto';

class RegisterDTO extends LoginDTO {
    @IsEmail({}, { message: 'Your username must be an email address...' })
    email: string;

    @IsString({ message: 'Your password appears to be invalid, please try to reload the page...' })
    @Length(8, 32, { message: 'Your password must be between 8 and 32 characters long...' })
    password: string;

    @IsBoolean({ message: 'Your must accept the terms of service before registering...' })
    termsOfService: boolean;
}

export { RegisterDTO };
