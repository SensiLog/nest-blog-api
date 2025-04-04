import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PostController } from './post/post.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User } from './user/user.entity';
import { Post } from './post/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [],
      useFactory: async () => ({
        type: 'postgres',
        host: 'dpg-cvntr8be5dus73e0t1n0-a.oregon-postgres.render.com',
        port: 5432,
        username: 'blog_api_iudh_user',
        password: 'vOV3fXbuAHC0CHpUMNVg6dH9klvZVuqL',
        database: 'blog_api_iudh',
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [User, Post],
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [],
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