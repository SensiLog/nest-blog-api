import { CreatePostDto } from './post.createdto';
import { Post as PostEntity } from './post.entity';
import { Repository } from 'typeorm';
export declare class PostController {
    private readonly postRepository;
    constructor(postRepository: Repository<PostEntity>);
    createPost(createPostDto: CreatePostDto, file: Express.Multer.File): Promise<{
        message: string;
        post: PostEntity;
    }>;
    getPostsPagination(userId: string, page?: number, limit?: number): Promise<{
        posts: [PostEntity[], number];
    }>;
    getPostById(id: string): Promise<{
        message: string;
        post?: undefined;
    } | {
        message: string;
        post: PostEntity;
    }>;
    updatePost(id: string, updatePostDto: CreatePostDto): Promise<{
        message: string;
    }>;
    deletePost(id: string): Promise<{
        message: string;
    }>;
    private uploadToS3;
}
