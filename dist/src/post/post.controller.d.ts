import { CreatePostDto } from './post.createdto';
import { Post as PostEntity } from './post.entity';
import { Repository } from 'typeorm';
import { Express } from 'express';
export declare class PostController {
    private readonly postRepository;
    constructor(postRepository: Repository<PostEntity>);
    createPost(createPostDto: CreatePostDto, file: Express.Multer.File, prefix: string): Promise<{
        message: string;
        post: PostEntity;
    }>;
    private uploadToS3;
}
