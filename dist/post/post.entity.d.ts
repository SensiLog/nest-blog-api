import { User } from '../user/user.entity';
export declare class Post {
    id: string;
    title: string;
    content: string;
    date: Date;
    imgUrl: string;
    user: User;
}
