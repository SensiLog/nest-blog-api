import {
    Controller,
    Post,
    Body,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Param,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CreatePostDto } from './post.createdto';
  import { s3 } from '../config/s3.config';
  import { Post as PostEntity } from './post.entity';
  import { Repository } from 'typeorm';
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

    // Upload da imagem para o S3
    const uploadResult = await this.uploadToS3(file, prefix);

    // Criar a entidade Post
    const post = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      imgUrl: uploadResult.Location, // URL retornada pelo S3
    });

    // Salvar no banco de dados
    const savedPost = await this.postRepository.save(post);

    // Retornar uma resposta descritiva
    return {
      message: 'Post created successfully',
      post: savedPost,
    };
  }

  private async uploadToS3(file: Express.Multer.File, prefix: string) {
    const bucketName = 'blogapi-sensilog';
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME is not defined in the environment variables');
    }

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