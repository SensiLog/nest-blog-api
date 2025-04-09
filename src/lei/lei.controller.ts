import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from "@nestjs/common";
import { Repository } from "typeorm";
import { Lei } from "./lei.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { StatusLei } from "./enum/enum.status-lei";

@Controller('leis')
export class LeiController {
    constructor(
        @InjectRepository(Lei)
        private readonly leiRepository: Repository<Lei>,
    ) {}

    @Post()
    async create(@Body() leiData: Lei) {
        const lei = this.leiRepository.create(leiData);
        return this.leiRepository.save(lei);
    }

    @Get('user/:userId')
    async findAllByUser(@Param('userId') userId: string) {
        try {
            const leis = this.leiRepository.find({
                where: { userId: userId },
            });
        if (!leis) {
            throw new NotFoundException(`Leis de ID ${userId} nao encontradas`);
        } return leis;
        } catch (error) {
            throw new NotFoundException(`Erro ao buscar`);
        }
    }

    @Get('find/:id')
    async findOne(@Param('id') id: string) {
        try {
            const lei = await this.leiRepository.findOneOrFail({ where: { id } });
            if (!lei) {
                throw new NotFoundException(`Lei de ID ${id} nao encontrada`);
            }
            
            return lei;
        } catch (error) {
            throw new NotFoundException(`Erro ao buscar `);
        }
    }

    @Get(':userId/sancionadas')
    async getLeisSancionadas(@Param('userId') userId: string,
                            @Query('page') page: number = 1,
                            @Query('limit') limit: number = 10,) {
        try {
            const [leis, totalCount] = await this.leiRepository.findAndCount({
                where: { userId: userId,
                         statusLei : StatusLei.SANCIONADA 
                        },
                        take: limit,
                        skip: (page - 1) * limit,
            });
            if (!leis) {
                throw new NotFoundException(`Leis do user de ID ${userId} nao encontradas`);
            }
            return {
                leis: leis,
                totalCount: totalCount,
                currentPage: page,
                pageSize: limit,
                totalPages: Math.ceil(totalCount / limit),
              };
        } catch (error) {
            throw new NotFoundException(`Erro ao buscar`);
        }
    }

    @Get(':userId/sancionadas')
    async getLeisProjetos(@Param('userId') userId: string,
                            @Query('page') page: number = 1,
                            @Query('limit') limit: number = 10,) {
        try {
            const [leis, totalCount] = await this.leiRepository.findAndCount({
                where: { userId: userId,
                         statusLei : StatusLei.PROJETO 
                        },
                        take: limit,
                        skip: (page - 1) * limit,
            });
            if (!leis) {
                throw new NotFoundException(`Leis do user de ID ${userId} nao encontradas`);
            }
            return {
                leis: leis,
                totalCount: totalCount,
                currentPage: page,
                pageSize: limit,
                totalPages: Math.ceil(totalCount / limit),
              };
        } catch (error) {
            throw new NotFoundException(`Erro ao buscar`);
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() leiData: Lei) {
        try {
            const lei = await this.leiRepository.findOneOrFail({ where: { id } });
            if (!lei) {
                throw new NotFoundException(`Lei de ID ${id} nao encontrada`);
            }
            this.leiRepository.merge(lei, leiData);
            return this.leiRepository.save(lei);
        } catch (error) {
            throw new NotFoundException(`Erro ao atualizar`);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            const lei = await this.leiRepository.findOneOrFail({ where: { id } });
            if (!lei) {
                throw new NotFoundException(`Lei de ID ${id} nao encontrada`);
            }
            return this.leiRepository.remove(lei);
        } catch (error) {
            throw new NotFoundException(`Erro ao deletar`);
        }
    }

}