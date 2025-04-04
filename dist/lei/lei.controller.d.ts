import { Repository } from "typeorm";
import { Lei } from "./lei.entity";
export declare class LeiController {
    private readonly leiRepository;
    constructor(leiRepository: Repository<Lei>);
    create(leiData: Lei): Promise<Lei>;
    findAllByUser(userId: string): Promise<Lei[]>;
    findOne(id: string): Promise<Lei>;
    update(id: string, leiData: Lei): Promise<Lei>;
    remove(id: string): Promise<Lei>;
}
