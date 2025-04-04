import { User } from "src/user/user.entity";
import { StatusLei } from "./enum/enum.status-lei";
export declare class Lei {
    id: string;
    numeroLei: string;
    ementa: string;
    conteudoLei: string;
    statusLei: StatusLei;
    userId: string;
    user: User;
}
