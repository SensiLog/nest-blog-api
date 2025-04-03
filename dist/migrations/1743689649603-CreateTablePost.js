"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTablePost1743689649603 = void 0;
class CreateTablePost1743689649603 {
    async up(queryRunner) {
        queryRunner.query(`
            CREATE TABLE IF NOT EXISTS post (
            id UUID PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            imgUrl VARCHAR(255) NOT NULL
            );
            `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE post`);
    }
}
exports.CreateTablePost1743689649603 = CreateTablePost1743689649603;
//# sourceMappingURL=1743689649603-CreateTablePost.js.map