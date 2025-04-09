"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
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
//# sourceMappingURL=data-source.js.map