import { Module } from '@nestjs/common';
import { VectorsService } from './vectors.service';
import { VectorsController } from './vectors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VectorSchema } from './vectors.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vector', schema: VectorSchema }]),
  ],
  providers: [VectorsService],
  controllers: [VectorsController]
})
export class VectorsModule {}
