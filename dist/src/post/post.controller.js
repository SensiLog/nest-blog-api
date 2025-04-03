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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const post_createdto_1 = require("./post.createdto");
const s3_config_1 = require("../config/s3.config");
const post_entity_1 = require("./post.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const express_1 = require("express");
const uuid_1 = require("uuid");
let PostController = class PostController {
    postRepository;
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async createPost(createPostDto, file, prefix) {
        if (!file) {
            throw new common_1.BadRequestException('Image file is required');
        }
        if (!prefix) {
            throw new common_1.BadRequestException('Prefix is required in the URL');
        }
        const uploadResult = await this.uploadToS3(file, prefix);
        const post = this.postRepository.create({
            title: createPostDto.title,
            content: createPostDto.content,
            imgUrl: uploadResult.Location,
        });
        const savedPost = await this.postRepository.save(post);
        return {
            message: 'Post created successfully',
            post: savedPost,
        };
    }
    async uploadToS3(file, prefix) {
        const bucketName = 'blogapi-sensilog';
        if (!bucketName) {
            throw new Error('AWS_S3_BUCKET_NAME is not defined in the environment variables');
        }
        try {
            const params = {
                Bucket: bucketName,
                Key: `${prefix}-${(0, uuid_1.v4)()}`,
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
    (0, common_1.Post)(':prefix'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Param)('prefix')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [post_createdto_1.CreatePostDto, typeof (_b = typeof express_1.Express !== "undefined" && (_a = express_1.Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPost", null);
exports.PostController = PostController = __decorate([
    (0, common_1.Controller)('posts'),
    __param(0, (0, typeorm_2.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], PostController);
//# sourceMappingURL=post.controller.js.map