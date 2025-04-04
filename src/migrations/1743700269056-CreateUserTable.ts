import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from 'typeorm';

export class CreateUserTable1743700269056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar a tabela 'user'
        await queryRunner.createTable(
            new Table({
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
            }),
            true, // Indica se a tabela deve ser criada se não existir
        );

        // Adicionar a coluna 'userId' na tabela 'posts' <------------------ ALTERAÇÃO AQUI
        await queryRunner.addColumn(
            'posts', // <--------------------------------------------------- ALTERAÇÃO AQUI
            new TableColumn({
                name: 'userId',
                type: 'uuid',
                isNullable: true,
            }),
        );

        // Criar a chave estrangeira na tabela 'posts' referenciando a tabela 'user' <--- ALTERAÇÃO AQUI
        await queryRunner.createForeignKey(
            'posts', // <--------------------------------------------------- ALTERAÇÃO AQUI
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverter as alterações (ordem inversa da criação)
        await queryRunner.dropForeignKey('posts', 'FK_post_user'); // <------- ALTERAÇÃO AQUI
        await queryRunner.dropColumn('posts', 'userId'); // <------------------ ALTERAÇÃO AQUI
        await queryRunner.dropTable('user');
    }

}