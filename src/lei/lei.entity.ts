import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatusLei } from "./enum/enum.status-lei";


@Entity('leis')
export class Lei {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    numeroLei: string;

    @Column()
    ementa: string;

    @Column()
    conteudoLei: string;

    @Column({
        type: 'enum',
        enum: StatusLei,
    })
    statusLei: StatusLei;

    @Column()
    userId: string;
    
    @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}