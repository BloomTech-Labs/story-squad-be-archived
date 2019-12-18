import { RegisterDTO } from './models/dto/register.dto';
import { LoginDTO } from './models/dto/login.dto';
import { Parent } from './database/entity/Parent';

declare global {
    namespace Express {
        interface Request {
            register: RegisterDTO;
            login: LoginDTO;
            user: Omit<Parent, 'password'>;
        }
    }
}
