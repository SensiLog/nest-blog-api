"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeiController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const lei_entity_1 = require("./lei.entity");
const typeorm_2 = require("@nestjs/typeorm");
const enum_status_lei_1 = require("./enum/enum.status-lei");
let LeiController = class LeiController {
    leiRepository;
    constructor(leiRepository) {
        this.leiRepository = leiRepository;
    }
    async create(leiData) {
        const lei = this.leiRepository.create(leiData);
        return this.leiRepository.save(lei);
    }
    async findAllByUser(userId) {
        try {
            const leis = this.leiRepository.find({
                where: { userId: userId },
            });
            if (!leis) {
                throw new common_1.NotFoundException(`Leis de ID ${userId} nao encontradas`);
            }
            return leis;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Erro ao buscar`);
        }
    }
    async findOne(id) {
        try {
            const lei = await this.leiRepository.findOneOrFail({ where: { id } });
            if (!lei) {
                throw new common_1.NotFoundException(`Lei de ID ${id} nao encontrada`);
            }
            return lei;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Erro ao buscar `);
        }
    }
    async getLeisSancionadas(userId, page = 1, limit = 10) {
        try {
            const [leis, totalCount] = await this.leiRepository.findAndCount({
                where: { userId: userId,
                    statusLei: enum_status_lei_1.StatusLei.SANCIONADA
                },
                take: limit,
                skip: (page - 1) * limit,
            });
            if (!leis) {
                throw new common_1.NotFoundException(`Leis do user de ID ${userId} nao encontradas`);
            }
            return {
                leis: leis,
                totalCount: totalCount,
                currentPage: page,
                pageSize: limit,
                totalPages: Math.ceil(totalCount / limit),
            };
        }
        catch (error) {
            throw new common_1.NotFoundException(`Erro ao buscar`);
        }
    }
    async getLeisProjetos(userId, page = 1, limit = 10) {
        try {
            const [leis, totalCount] = await this.leiRepository.findAndCount({
                where: { userId: userId,
                    statusLei: enum_status_lei_1.StatusLei.PROJETO
                },
                take: limit,
                skip: (page - 1) * limit,
            });
            if (!leis) {
                throw new common_1.NotFoundException(`Leis do user de ID ${userId} nao encontradas`);
            }
            return {
                leis: leis,
                totalCount: totalCount,
                currentPage: page,
                pageSize: limit,
                totalPages: Math.ceil(totalCount / limit),
            };
        }
        catch (error) {
            throw new common_1.NotFoundException(`Erro ao buscar`);
        }
    }
    async update(id, leiData) {
        try {
            const lei = await this.leiRepository.findOneOrFail({ where: { id } });
            if (!lei) {
                throw new common_1.NotFoundException(`Lei de ID ${id} nao encontrada`);
            }
            this.leiRepository.merge(lei, leiData);
            return this.leiRepository.save(lei);
        }
        catch (error) {
            throw new common_1.NotFoundException(`Erro ao atualizar`);
        }
    }
    async remove(id) {
        try {
            const lei = await this.leiRepository.findOneOrFail({ where: { id } });
            if (!lei) {
                throw new common_1.NotFoundException(`Lei de ID ${id} nao encontrada`);
            }
            return this.leiRepository.remove(lei);
        }
        catch (error) {
            throw new common_1.NotFoundException(`Erro ao deletar`);
        }
    }
};
exports.LeiController = LeiController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lei_entity_1.Lei]),
    __metadata("design:returntype", Promise)
], LeiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeiController.prototype, "findAllByUser", null);
__decorate([
    (0, common_1.Get)('find/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':userId/sancionadas'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], LeiController.prototype, "getLeisSancionadas", null);
__decorate([
    (0, common_1.Get)(':userId/projeto'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], LeiController.prototype, "getLeisProjetos", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lei_entity_1.Lei]),
    __metadata("design:returntype", Promise)
], LeiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeiController.prototype, "remove", null);
exports.LeiController = LeiController = __decorate([
    (0, common_1.Controller)('leis'),
    __param(0, (0, typeorm_2.InjectRepository)(lei_entity_1.Lei)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], LeiController);
//# sourceMappingURL=lei.controller.js.map