import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lei } from './lei.entity';
import { LeiController } from './lei.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Lei])],
    controllers: [LeiController],
    exports: [TypeOrmModule]
})
export class LeiModule {}