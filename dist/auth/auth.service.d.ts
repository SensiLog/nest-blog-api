import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/user.createdto';
import { UserLoginDto } from './dto/user.login.dto';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<any>;
    login(loginUserDto: UserLoginDto): Promise<{
        access_token: string;
    }>;
}
