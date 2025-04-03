"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostTable1743640461490 = void 0;
class CreatePostTable1743640461490 {
    name = 'CreatePostTable1743640461490';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar NOT NULL, "date" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "post"`);
    }
}
exports.CreatePostTable1743640461490 = CreatePostTable1743640461490;
//# sourceMappingURL=1743640461490-CreatePostTable.js.map