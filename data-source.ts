import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: ['./dist/src/**/*.entity.js'], // Caminho direto
  migrations: ['./dist/migrations/*.js'], // Caminho direto
  synchronize: false,
});