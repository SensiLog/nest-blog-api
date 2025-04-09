import { Post } from '../post/post.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    date: Date;
    password: string;
    posts: Post[];
}
