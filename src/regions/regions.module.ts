import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionsSchema } from './regions.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Regions', schema: RegionsSchema }]),
  ],
  providers: [RegionsService],
  controllers: [RegionsController]
})
export class RegionsModule { }
