import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'; // Importe ConfigModule
import { JwtModule } from '@nestjs/jwt';
import { PostController } from './post/post.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User } from './user/user.entity'; // Importe a entidade User
import { Post } from './post/post.entity'; // Importe a entidade Post

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [], // ConfigService será injetado no useFactory
      useFactory: async () => ({
        type: 'sqlite', // Defina o tipo do banco de dados como 'sqlite'
        database: 'database.sqlite', // Especifique o nome do arquivo do banco de dados SQLite
        entities: [User, Post], // Adicione suas entidades aqui
        synchronize: false, // Não use em produção!
        autoLoadEntities: true, // Carrega automaticamente as entidades
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [], // ConfigService será injetado no useFactory
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
      }),
    }),
    PostModule,
    UserModule,
    AuthModule,
  ],
  controllers: [PostController, AuthController],
  providers: [AuthService],
})
export class AppModule {}