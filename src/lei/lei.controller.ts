import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { Repository } from "typeorm";
import { Lei } from "./lei.entity";

@Controller('leis')
export class LeiController {
    constructor(private readonly leiRepository: Repository<Lei>) {}

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