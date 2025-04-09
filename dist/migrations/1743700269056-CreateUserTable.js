"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1743700269056 = void 0;
const typeorm_1 = require("typeorm");
class CreateUserTable1743700269056 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'user',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'gen_random_uuid()',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'date',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
            ],
        }), true);
        await queryRunner.addColumn('posts', new typeorm_1.TableColumn({
            name: 'userId',
            type: 'uuid',
            isNullable: true,
        }));
        await queryRunner.createForeignKey('posts', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey('posts', 'FK_post_user');
        await queryRunner.dropColumn('posts', 'userId');
        await queryRunner.dropTable('user');
    }
}
exports.CreateUserTable1743700269056 = CreateUserTable1743700269056;
//# sourceMappingURL=1743700269056-CreateUserTable.js.map