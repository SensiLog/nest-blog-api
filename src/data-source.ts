import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  database: 'blog_api',
  port: 5432,
  username: 'postgres',
  password: 'root',
  host: 'localhost',
  entities: ['./dist/src/**/*.entity.js'],
  migrations: ['./dist/migrations/*.js'],
  synchronize: false,
});