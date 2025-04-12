import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './post.createdto';
import { s3 } from '../config/s3.config';
import { Post as PostEntity } from './post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('posts')
export class PostController {
  constructor(
      @InjectRepository(PostEntity)
      private readonly postRepository: Repository<PostEntity>,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
      @Body() createPostDto: CreatePostDto,
      @UploadedFile() file: Express.Multer.File,
  ) {
      if (!createPostDto.userId) {
          throw new BadRequestException('User ID is required');
      }
      let imgUrl = 'https://thumbs.dreamstime.com/b/homem-s%C3%A9rio-novo-103797384.jpg';
      if (file) {
        const uploadResult = await this.uploadToS3(file, createPostDto.userId);
        imgUrl = uploadResult.Location;
      }
      const post = this.postRepository.create({
          title: createPostDto.title,
          content: createPostDto.content,
          imgUrl: imgUrl,
          userId: createPostDto.userId,
      });
      const savedPost = await this.postRepository.save(post);
      console.log('Post criado com ID:', savedPost.id, 'para o usuário:', savedPost.userId);
      return {
          message: 'Post created successfully',
          post: savedPost,
      };
  }

  @Get('user/:userId')
  async getPostsPagination(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 30,
  ) {
    const [posts, totalCount] = await this.postRepository.findAndCount({
      where: {
        userId: userId,
      },
      order: {
        date: 'DESC'
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      posts: posts,
      totalCount: totalCount,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }




  @Get('find/:id')
  async getPostById(@Param('id') id: string) {
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

  @Patch(':id')
  async updatePost(
      @Param('id') id: string,
      @Body() updatePostDto: CreatePostDto,
  ) {
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

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
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

  // Funções auxiliares
  private async uploadToS3(file: Express.Multer.File, userName: string) {
      const bucketName = 'blogapi-sensilog';

      try {
          const params = {
              Bucket: bucketName,
              Key: `user-${userName}/${uuidv4()}`,
              Body: file.buffer,
              ContentType: file.mimetype,
          };

          return await s3.upload(params).promise();
      } catch (error) {
          throw new BadRequestException('Failed to upload image to S3');
      }
  }
}