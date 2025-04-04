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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const post_createdto_1 = require("./post.createdto");
const s3_config_1 = require("../config/s3.config");
const post_entity_1 = require("./post.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const uuid_1 = require("uuid");
let PostController = class PostController {
    postRepository;
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async createPost(createPostDto, file) {
        if (!file) {
            throw new common_1.BadRequestException('Image file is required');
        }
        if (!createPostDto.userId) {
            throw new common_1.BadRequestException('User ID is required');
        }
        const uploadResult = await this.uploadToS3(file, createPostDto.userId);
        const post = this.postRepository.create({
            title: createPostDto.title,
            content: createPostDto.content,
            imgUrl: uploadResult.Location,
            userId: createPostDto.userId,
        });
        const savedPost = await this.postRepository.save(post);
        console.log('Post criado com ID:', savedPost.id, 'para o usuário:', savedPost.userId);
        return {
            message: 'Post created successfully',
            post: savedPost,
        };
    }
    async getPostsByUser(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('User ID is required in the URL');
        }
        const posts = await this.postRepository.find({
            where: { userId: userId },
        });
        if (posts.length === 0) {
            return {
                message: 'Nenhum post encontrado para este usuário.',
            };
        }
        return {
            message: 'Posts encontrados com sucesso',
            posts: posts,
        };
    }
    async getPostsPagination(userId, page = 1, limit = 30) {
        const posts = await this.postRepository.findAndCount({
            where: {
                userId: userId,
            },
            take: limit,
            skip: (page - 1) * limit
        });
        return {
            posts: posts
        };
    }
    async getPostById(id) {
        const post = await this.postRepository.findOne({
            where: { id: id },
        });
        if (post == null) {
            return {
                message: 'Post não encontrado',
            };
        }
        return {
            message: 'Post encontrado com sucesso',
            post: post,
        };
    }
    async updatePost(id, updatePostDto) {
        const post = await this.postRepository.findOne({
            where: { id: id },
        });
        if (post == null) {
            return {
                message: 'Post não encontrado',
            };
        }
        await this.postRepository.update(id, updatePostDto);
        return {
            message: 'Post atualizado com sucesso',
        };
    }
    async deletePost(id) {
        const post = await this.postRepository.findOne({
            where: { id: id },
        });
        if (post == null) {
            return {
                message: 'Post não encontrado',
            };
        }
        await this.postRepository.delete(id);
        return {
            message: 'Post deletado com sucesso',
        };
    }
    async uploadToS3(file, userName) {
        const bucketName = 'blogapi-sensilog';
        try {
            const params = {
                Bucket: bucketName,
                Key: `user-${userName}/${(0, uuid_1.v4)()}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            return await s3_config_1.s3.upload(params).promise();
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to upload image to S3');
        }
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [post_createdto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPostsByUser", null);
__decorate([
    (0, common_1.Get)('find/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPostsPagination", null);
__decorate([
    (0, common_1.Get)('find/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPostById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, post_createdto_1.CreatePostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePost", null);
exports.PostController = PostController = __decorate([
    (0, common_1.Controller)('posts'),
    __param(0, (0, typeorm_2.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], PostController);
//# sourceMappingURL=post.controller.js.map