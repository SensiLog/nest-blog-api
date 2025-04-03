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
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CreatePostDto } from './post.createdto';
  import { s3 } from '../config/s3.config';
  import { Post as PostEntity } from './post.entity';
  import { Repository, Like } from 'typeorm';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Express } from 'express';
  import { v4 as uuidv4 } from 'uuid';

@Controller('posts')
export class PostController {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  @Post(':prefix')
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('prefix') prefix: string,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    if (!prefix) {
      throw new BadRequestException('Prefix is required in the URL');
    }
    const uploadResult = await this.uploadToS3(file, prefix);
    const post = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      imgUrl: uploadResult.Location, // URL retornada pelo S3
    });
    const savedPost = await this.postRepository.save(post);
    console.log('Post criado com ID:', savedPost.id);
    return {
      message: 'Post created successfully',
      post: savedPost,
    };
  }

  @Get(':prefix')
  async getPostsByPrefix(@Param('prefix') prefix: string) {
    if (!prefix) {
      throw new BadRequestException('Prefix is required in the URL');
    }

    const posts = await this.postRepository.find({
      where: { imgUrl: Like(`%${prefix}%`) },
    });
    if (posts.length === 0) {
      return {
        message: 'Nenhum post encontrado.'
      }
    }

    return {
      message: 'Posts encontrados com sucesso',
      posts: posts
    };

  }

  @Get('find/:id')
  async getPostById(@Param('id') id: string) {
    const post = await this.postRepository.findOne({
      where: { id: id },
    });
    if (post == null) {
      return {
        message: 'Post não encontrado'
      }
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
        message: 'Post não encontrado'
      }
    }
    await this.postRepository.update(id, updatePostDto);
    return {
      message: 'Post atualizado com sucesso'
    };
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    const post = await this.postRepository.findOne({
      where: { id: id },
    });
    if (post == null) {
      return {
        message: 'Post não encontrado'
      }
    }
    await this.postRepository.delete(id);
    return {
      message: 'Post deletado com sucesso'
    };
  }


  // Funções auxiliares
  private async uploadToS3(file: Express.Multer.File, prefix: string) {
    const bucketName = 'blogapi-sensilog';

    try {
      const params = {
        Bucket: bucketName, // Nome do bucket
        Key: `${prefix}-${uuidv4()}`, // Prefixo + UUID + nome do arquivo
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      return await s3.upload(params).promise();
    } catch (error) {
      throw new BadRequestException('Failed to upload image to S3');
    }
  }
}