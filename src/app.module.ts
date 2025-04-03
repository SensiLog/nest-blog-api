import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite', // Nome do arquivo do banco de dados
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Carrega todas as entidades
      synchronize: true, // Desative em produção; usaremos migrations
    }),
    PostModule,
  ],
})
export class AppModule {}