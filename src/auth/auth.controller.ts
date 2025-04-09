import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/user.createdto';
import { UserLoginDto } from './dto/user.login.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiCreatedResponse({ description: 'Usuário registrado com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados de registro inválidos.' })
    async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @HttpCode(HttpStatus.OK) // Define o status code para 200 OK no login
    @Post('login')
    @ApiOkResponse({ description: 'Login realizado com sucesso.', schema: { type: 'object', properties: { access_token: { type: 'string' } } } })
    @ApiBadRequestResponse({ description: 'Dados de login inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Credenciais inválidas.' })
    async login(@Body(ValidationPipe) loginUserDto: UserLoginDto) {
        return this.authService.login(loginUserDto);
    }
}