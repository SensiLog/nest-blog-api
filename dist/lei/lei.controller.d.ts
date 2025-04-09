import { Repository } from "typeorm";
import { Lei } from "./lei.entity";
export declare class LeiController {
    private readonly leiRepository;
    constructor(leiRepository: Repository<Lei>);
    create(leiData: Lei): Promise<Lei>;
    findAllByUser(userId: string): Promise<Lei[]>;
    findOne(id: string): Promise<Lei>;
    getLeisSancionadas(userId: string, page?: number, limit?: number): Promise<{
        leis: Lei[];
        totalCount: number;
        currentPage: number;
        pageSize: number;
        totalPages: number;
    }>;
    getLeisProjetos(userId: string, page?: number, limit?: number): Promise<{
        leis: Lei[];
        totalCount: number;
        currentPage: number;
        pageSize: number;
        totalPages: number;
    }>;
    update(id: string, leiData: Lei): Promise<Lei>;
    remove(id: string): Promise<Lei>;
}
