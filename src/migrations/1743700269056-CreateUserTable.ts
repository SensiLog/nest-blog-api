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
                        default: 'uuid_generate_v4()',
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

        // Adicionar a coluna 'userId' na tabela 'post'
        await queryRunner.addColumn(
            'post',
            new TableColumn({
                name: 'userId',
                type: 'uuid',
                isNullable: true, // Permite que posts existentes não tenham um usuário inicialmente (você pode alterar isso se necessário)
            }),
        );

        // Criar a chave estrangeira na tabela 'post' referenciando a tabela 'user'
        await queryRunner.createForeignKey(
            'post',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE', // Define o comportamento em caso de exclusão do usuário (você pode usar 'SET NULL' ou 'RESTRICT' dependendo da sua lógica)
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverter as alterações (ordem inversa da criação)
        await queryRunner.dropForeignKey('post', 'FK_post_user'); // O nome da FK pode variar dependendo do seu banco
        await queryRunner.dropColumn('post', 'userId');
        await queryRunner.dropTable('user');
    }

}