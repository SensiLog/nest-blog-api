import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/user.createdto'; // Crie este DTO
import { UserLoginDto } from './dto/user.login.dto'; // Crie este DTO
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity'; // Importe a entidade User

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async register(createUserDto: CreateUserDto): Promise<any> {
        const { password } = createUserDto;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = this.userRepository.create({ ...createUserDto, password: hashedPassword });
        await this.userRepository.save(user);
        return {
            message: 'Usuário registrado com sucesso!',
            userId: user.id
        };
    }

    async login(loginUserDto: UserLoginDto): Promise<{ access_token: string }> {
        const { email, password } = loginUserDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { sub: user.id, email: user.email };
        const access_token = this.jwtService.sign(payload);
        return { access_token };
    }
}