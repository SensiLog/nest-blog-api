import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/user.createdto';
import { UserLoginDto } from './dto/user.login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<any>;
    login(loginUserDto: UserLoginDto): Promise<{
        access_token: string;
    }>;
}
